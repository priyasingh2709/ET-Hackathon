from collections import defaultdict
from prisma import Prisma

def extract_topics(article):
    if not article.categories:
        return []
    return [t.strip().lower() for t in article.categories.split(",") if t.strip()]

async def build_interest_graph(db, user_id: str):
    history = await db.readinghistory.find_many(
        where={"userId": user_id},
        include={"article": True}
    )

    graph = defaultdict(float)

    for entry in history:
        topics = extract_topics(entry.article)
        weight = min(entry.timeSpent / 60, 5)  

        for topic in topics:
            graph[topic] += weight
    sorted_graph = dict(sorted(graph.items(), key=lambda x: x[1], reverse=True))

    return sorted_graph

def rank_topics_for_user(user, interest_graph):
    if interest_graph:
        return list(interest_graph.keys())

    if user.interests:
        return [i.strip().lower() for i in user.interests.split(",")]

    return ["technology", "markets", "economy"]


async def generate_feed(db, user_id: str):
    user = await db.user.find_unique(where={"id": user_id})

    interest_graph = await build_interest_graph(db, user_id)
    ranked_topics = rank_topics_for_user(user, interest_graph)

    articles = await db.article.find_many(
        order={"publishedAt": "desc"}
    )

    scored_articles = []

    for article in articles:
        topics = extract_topics(article)

        score = 0
        for topic in topics:
            score += interest_graph.get(topic, 0)

            scored_articles.append((score, article))

    scored_articles.sort(key=lambda x: x[0], reverse=True)

    return [a for _, a in scored_articles]

def build_why_this_matters(user_role, article):
    role_map = {
        "student": article.studentInsight,
        "investor": article.investorInsight,
        "developer": article.developerInsight,
        "founder": article.founderInsight,
    }

    return role_map.get((user_role or "").lower()) or "Relevant to your interests."
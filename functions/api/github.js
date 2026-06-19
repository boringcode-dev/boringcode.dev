const GITHUB_API_BASE = "https://api.github.com"
const ORG_NAME = "boringcode-dev"
const FEATURED_REPOS_LIMIT = 9
const REPOS_PER_PAGE = 100
const ORG_CACHE_TTL_SECONDS = 60 * 60
const REPOS_CACHE_TTL_SECONDS = 30 * 60

const FALLBACK_ORG = {
  login: ORG_NAME,
  name: "BoringCode.dev",
  description: "We write the boring stuff, so you don't have to.",
  avatar_url: "/logo.png",
  html_url: `https://github.com/${ORG_NAME}`,
  public_repos: 0,
}

const FALLBACK_REPOS = {
  repos: [],
  totalCount: 0,
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const type = url.searchParams.get("type")

  if (type !== "org" && type !== "repos") {
    return jsonResponse({ error: "Invalid type parameter" }, 400, {
      "Cache-Control": "no-store",
    })
  }

  const cache = caches.default
  const cacheKey = new Request(url.toString(), {
    method: "GET",
    headers: context.request.headers,
  })
  const cachedResponse = await cache.match(cacheKey)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const responseData = type === "org" ? await fetchOrg(context.env.GITHUB_TOKEN) : await fetchFeaturedRepos(context.env.GITHUB_TOKEN)

    const ttl = type === "org" ? ORG_CACHE_TTL_SECONDS : REPOS_CACHE_TTL_SECONDS
    const response = jsonResponse(responseData, 200, cacheHeaders(ttl))

    context.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  } catch (error) {
    console.error("GitHub API Error:", error)

    const fallbackData = type === "org" ? FALLBACK_ORG : FALLBACK_REPOS
    return jsonResponse(fallbackData, 200, {
      ...cacheHeaders(60),
      "X-Data-Source": "fallback",
    })
  }
}

async function fetchOrg(token) {
  const orgResponse = await fetchGitHub(`/orgs/${ORG_NAME}`, token)

  if (orgResponse.status === 404) {
    return FALLBACK_ORG
  }

  if (!orgResponse.ok) {
    throw new Error(`Failed to fetch organization: ${orgResponse.status}`)
  }

  const orgData = await orgResponse.json()
  return {
    ...orgData,
    avatar_url: "/logo.png",
  }
}

async function fetchFeaturedRepos(token) {
  const repos = await fetchAllRepos(token)

  const filteredRepos = repos
    .filter((repo) => !repo.name.includes(".github") && !repo.name.toLowerCase().includes("test"))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)

  return {
    repos: filteredRepos.slice(0, FEATURED_REPOS_LIMIT),
    totalCount: filteredRepos.length,
  }
}

async function fetchAllRepos(token) {
  const repos = []

  for (let page = 1; page <= 50; page += 1) {
    const reposResponse = await fetchGitHub(
      `/orgs/${ORG_NAME}/repos?type=public&sort=updated&per_page=${REPOS_PER_PAGE}&page=${page}`,
      token,
    )

    if (reposResponse.status === 404) {
      return []
    }

    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repositories: ${reposResponse.status}`)
    }

    const pageRepos = await reposResponse.json()
    repos.push(...pageRepos)

    if (pageRepos.length < REPOS_PER_PAGE) {
      break
    }
  }

  return repos
}

function fetchGitHub(path, token) {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "User-Agent": "BoringCode-Landing-Page",
  })

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return fetch(`${GITHUB_API_BASE}${path}`, {
    headers,
  })
}

function cacheHeaders(ttlSeconds) {
  return {
    "Cache-Control": `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=86400`,
  }
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  })
}

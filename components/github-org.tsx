"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, ExternalLink, Calendar } from "lucide-react"
import Image from "next/image"

interface Repository {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  pushed_at: string
}

interface Organization {
  login: string
  name: string
  description: string | null
  avatar_url: string
  html_url: string
  public_repos: number
}

export function GitHubOrg() {
  const [org, setOrg] = useState<Organization | null>(null)
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orgName = "boringcode-dev"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch organization info
        const orgResponse = await fetch(`https://api.github.com/orgs/${orgName}`)
        if (!orgResponse.ok) throw new Error("Failed to fetch organization")
        const orgData = await orgResponse.json()
        setOrg(orgData)

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/orgs/${orgName}/repos?sort=updated&per_page=50`)
        if (!reposResponse.ok) throw new Error("Failed to fetch repositories")
        const reposData = await reposResponse.json()

        // Filter out forks and sort by stars
        const filteredRepos = reposData
          .filter((repo: Repository) => !repo.name.includes(".github"))
          .sort((a: Repository, b: Repository) => b.stargazers_count - a.stargazers_count)

        setRepos(filteredRepos)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Shell: "bg-green-500",
      HTML: "bg-orange-500",
      CSS: "bg-purple-500",
      Python: "bg-blue-600",
      Go: "bg-cyan-500",
    }
    return colors[language || ""] || "bg-gray-400"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          {org?.avatar_url && (
            <Image
              src={org.avatar_url || "/placeholder.svg"}
              alt={`${org.name} logo`}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{org?.name || "BoringCode.dev"}</h1>
        <p className="text-xl text-gray-600 mb-6">
          {org?.description || "We write the boring stuff, so you don't have to."}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>{org?.public_repos} public repositories</span>
          <a
            href={org?.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-700 transition-colors"
          >
            View on GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <Card key={repo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {repo.name}
                    </a>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {repo.description || "No description available"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Language and Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                        <span>{repo.language}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>
                </div>

                {/* Topics */}
                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {repo.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{repo.topics.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Last Updated */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Built with Next.js and Tailwind CSS • Data from GitHub API</p>
      </footer>
    </div>
  )
}

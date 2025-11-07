import axios, {
  type AxiosInstance,
  type AxiosResponseHeaders,
  type RawAxiosResponseHeaders,
} from "axios";

const USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  blog: string;
  location: string;
  email: string | null;
  hireable: boolean | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  company: string | null;
  twitter_username: string | null;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: string;
  default_branch: string;
  fork: boolean;
}

interface GitHubGist {
  id: string;
  description: string | null;
  public: boolean;
  created_at: string;
  updated_at: string;
  html_url: string;
  files: Record<
    string,
    {
      filename: string;
      type: string;
      language: string | null;
      raw_url: string;
      size: number;
    }
  >;
}

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: Record<string, unknown>;
}

interface GitHubLanguages {
  [key: string]: number;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

class GitHubAPI {
  private client: AxiosInstance;
  private rateLimit: RateLimit | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    this.client.interceptors.response.use(
      (response) => {
        this.updateRateLimit(response.headers);
        return response;
      },
      (error) => {
        if (error.response) {
          this.updateRateLimit(error.response.headers);
        }
        return Promise.reject(error);
      },
    );
  }

  private updateRateLimit(
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
  ) {
    if (headers["x-ratelimit-limit"]) {
      this.rateLimit = {
        limit: Number.parseInt(String(headers["x-ratelimit-limit"]), 10),
        remaining: Number.parseInt(
          String(headers["x-ratelimit-remaining"]),
          10,
        ),
        reset: Number.parseInt(String(headers["x-ratelimit-reset"]), 10),
        used: Number.parseInt(String(headers["x-ratelimit-used"]), 10),
      };
    }
  }

  getRateLimit(): RateLimit | null {
    return this.rateLimit;
  }

  async checkRateLimit(): Promise<RateLimit> {
    try {
      const response = await this.client.get("/rate_limit");
      return response.data.rate;
    } catch (error) {
      console.error("Error checking rate limit:", error);
      throw error;
    }
  }

  async getUser(username?: string): Promise<GitHubUser> {
    try {
      const user = username || USERNAME;
      if (!user) {
        throw new Error("GitHub username not provided");
      }
      const response = await this.client.get(`/users/${user}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async getUserRepos(
    username?: string,
    options?: {
      type?: "all" | "owner" | "member";
      sort?: "created" | "updated" | "pushed" | "full_name";
      direction?: "asc" | "desc";
      per_page?: number;
      page?: number;
    },
  ): Promise<GitHubRepo[]> {
    try {
      const user = username || USERNAME;
      if (!user) {
        throw new Error("GitHub username not provided");
      }

      const params = {
        type: options?.type || "owner",
        sort: options?.sort || "updated",
        direction: options?.direction || "desc",
        per_page: options?.per_page || 100,
        page: options?.page || 1,
      };

      const response = await this.client.get(`/users/${user}/repos`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching repos:", error);
      throw error;
    }
  }

  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching repo:", error);
      throw error;
    }
  }

  async getRepoLanguages(
    owner: string,
    repo: string,
  ): Promise<GitHubLanguages> {
    try {
      const response = await this.client.get(
        `/repos/${owner}/${repo}/languages`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching repo languages:", error);
      throw error;
    }
  }

  async getRepoCommits(
    owner: string,
    repo: string,
    options?: {
      per_page?: number;
      page?: number;
      sha?: string;
    },
  ): Promise<GitHubCommit[]> {
    try {
      const params = {
        per_page: options?.per_page || 30,
        page: options?.page || 1,
        ...(options?.sha && { sha: options.sha }),
      };

      const response = await this.client.get(
        `/repos/${owner}/${repo}/commits`,
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching repo commits:", error);
      throw error;
    }
  }

  async getRepoReadme(owner: string, repo: string): Promise<string> {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}/readme`, {
        headers: {
          Accept: "application/vnd.github.v3.raw",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching repo README:", error);
      throw error;
    }
  }

  async getUserGists(username?: string): Promise<GitHubGist[]> {
    try {
      const user = username || USERNAME;
      if (!user) {
        throw new Error("GitHub username not provided");
      }
      const response = await this.client.get(`/users/${user}/gists`);
      return response.data;
    } catch (error) {
      console.error("Error fetching gists:", error);
      throw error;
    }
  }

  async getUserEvents(
    username?: string,
    options?: {
      per_page?: number;
      page?: number;
    },
  ): Promise<GitHubEvent[]> {
    try {
      const user = username || USERNAME;
      if (!user) {
        throw new Error("GitHub username not provided");
      }

      const params = {
        per_page: options?.per_page || 30,
        page: options?.page || 1,
      };

      const response = await this.client.get(`/users/${user}/events`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user events:", error);
      throw error;
    }
  }

  async searchRepositories(
    query: string,
    options?: {
      sort?: "stars" | "forks" | "updated";
      order?: "asc" | "desc";
      per_page?: number;
      page?: number;
    },
  ): Promise<{ items: GitHubRepo[]; total_count: number }> {
    try {
      const params = {
        q: query,
        sort: options?.sort,
        order: options?.order || "desc",
        per_page: options?.per_page || 30,
        page: options?.page || 1,
      };

      const response = await this.client.get("/search/repositories", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error searching repositories:", error);
      throw error;
    }
  }

  async getPinnedRepos(username?: string): Promise<GitHubRepo[]> {
    try {
      const user = username || USERNAME;
      if (!user) {
        throw new Error("GitHub username not provided");
      }

      const repos = await this.getUserRepos(user, {
        sort: "updated",
        per_page: 6,
      });

      return repos.filter((repo) => !repo.fork).slice(0, 6);
    } catch (error) {
      console.error("Error fetching pinned repos:", error);
      throw error;
    }
  }

  async getContributions(
    username?: string,
    _year?: number,
  ): Promise<Record<string, number>> {
    try {
      const user = username || USERNAME;
      if (!user) {
        throw new Error("GitHub username not provided");
      }

      const events = await this.getUserEvents(user, { per_page: 100 });

      const contributions = events.reduce(
        (acc: Record<string, number>, event: GitHubEvent) => {
          const date = new Date(event.created_at).toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        },
        {},
      );

      return contributions;
    } catch (error) {
      console.error("Error fetching contributions:", error);
      throw error;
    }
  }
}

export const githubAPI = new GitHubAPI();

export type {
  GitHubUser,
  GitHubRepo,
  GitHubLanguages,
  GitHubCommit,
  RateLimit,
};

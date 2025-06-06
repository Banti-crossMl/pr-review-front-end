export interface Repository {
  id: number;
  owner: string;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  updated_at: string;
  created_at: string;
}

export interface RepositoryResponse {
  status: string;
  count: number;
  page: number;
  data: Repository[];
}

export const repositoryData: RepositoryResponse = {
  status: "success",
  count: 10,
  page: 1,
  data: [
    {
      id: 1,
      owner: "Sahilcrossml",
      name: "codeReview",
      description:
        "A comprehensive code review tool built with Python for analyzing and improving code quality.",
      html_url: "https://github.com/Sahilcrossml/codeReview",
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 2,
      private: false,
      updated_at: "2025-06-06T09:51:10.808336Z",
      created_at: "2025-06-06T09:47:36.693560Z",
    },
    {
      id: 2,
      owner: "Sahilcrossml",
      name: "CodeRewiew",
      description: "",
      html_url: "https://github.com/Sahilcrossml/CodeRewiew",
      language: "",
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      private: false,
      updated_at: "2025-06-06T09:51:10.812737Z",
      created_at: "2025-06-06T09:47:36.700126Z",
    },
    {
      id: 3,
      owner: "Sahilcrossml",
      name: "assingment",
      description:
        "Assignment repository containing various coding exercises and solutions.",
      html_url: "https://github.com/Sahilcrossml/assingment",
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      private: false,
      updated_at: "2025-06-06T09:51:10.817214Z",
      created_at: "2025-06-06T09:47:36.704713Z",
    },
    {
      id: 4,
      owner: "payal-crossml",
      name: "retail-ai-agent-backend-api",
      description:
        "Backend API for retail AI agent with advanced machine learning capabilities.",
      html_url: "https://github.com/payal-crossml/retail-ai-agent-backend-api",
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      private: true,
      updated_at: "2025-06-06T09:51:10.821050Z",
      created_at: "2025-06-06T09:47:36.709355Z",
    },
  ],
};

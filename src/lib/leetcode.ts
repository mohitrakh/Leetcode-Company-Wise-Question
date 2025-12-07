import axios from 'axios';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

export interface LeetCodeSubmission {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
}

export const getRecentSubmissions = async (username: string, limit: number = 20): Promise<LeetCodeSubmission[]> => {
    const query = `
    query getRecentSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
        }
    }
    `;

    try {
        const response = await axios.post(LEETCODE_API_URL, {
            query,
            variables: { username, limit }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            }
        });

        if (response.data.errors) {
            console.error('LeetCode API Errors:', response.data.errors);
            throw new Error(response.data.errors[0].message);
        }

        return response.data.data.recentAcSubmissionList;
    } catch (error) {
        console.error('Failed to fetch LeetCode submissions:', error);
        throw error;
    }
};

export interface SolvedProblem {
    title: string;
    titleSlug: string;
    difficulty: string;
    topicTags: { name: string }[];
}

export const getAllSolvedProblems = async (sessionCookie: string): Promise<SolvedProblem[]> => {
    const query = `
    query userSessionProgress($username: String!) {
        allQuestionsCount {
            difficulty
            count
        }
        matchedUser(username: $username) {
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
        }
    }
    `;

    // First we need to get the username from the session
    // Actually, we can just use the problemsetQuestionList query which works for the authenticated user
    // regardless of username if we have the cookie.

    // However, to be safe and follow standard patterns, let's try to get the user's profile first or just use the list query.
    // The problemsetQuestionList query is good.

    const listQuery = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
        ) {
            total: totalNum
            questions: data {
                title
                titleSlug
                difficulty
                topicTags {
                    name
                }
                status
            }
        }
    }
    `;

    let allProblems: SolvedProblem[] = [];
    let skip = 0;
    const limit = 100;
    let hasMore = true;

    try {
        while (hasMore) {
            const response = await axios.post(LEETCODE_API_URL, {
                query: listQuery,
                variables: {
                    categorySlug: "",
                    limit: limit,
                    skip: skip,
                    filters: {
                        status: "AC"
                    }
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `LEETCODE_SESSION=${sessionCookie}`,
                    'Referer': 'https://leetcode.com'
                }
            });

            if (response.data.errors) {
                console.error('LeetCode API Errors:', response.data.errors);
                throw new Error(response.data.errors[0].message);
            }

            const data = response.data.data.problemsetQuestionList;
            const questions = data.questions;

            if (questions.length === 0) {
                hasMore = false;
            } else {
                // Filter only AC status just in case, though the filter should handle it
                const solved = questions.filter((q: any) => q.status === 'ac');
                allProblems = [...allProblems, ...solved];
                skip += limit;

                // Safety break to prevent infinite loops if something goes wrong with pagination
                if (allProblems.length >= data.total) {
                    hasMore = false;
                }
            }

            // Respect rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return allProblems;
    } catch (error) {
        console.error('Failed to fetch all solved problems:', error);
        throw error;
    }
};

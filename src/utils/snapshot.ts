import axios from "axios";

export async function queryGetVotes(proposal: string) {
    const res = await axios.post("https://hub.snapshot.org/graphql/query", {
        query: `query Votes {
        votes(first: 1000, skip: 0, where: {proposal: "${proposal}"}, orderBy: "created", orderDirection: desc) {
          id
          voter
          created
          proposal {
            id
          }
          choice
          space {
            id
          }
        }
      }
      `});

    console.log('queryGetVotes', res);
}

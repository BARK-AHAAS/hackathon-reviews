import Head from 'next/head';
import Link from "next/link";
import styles from '../../styles/Home.module.css';
import { client, requestBuilder, headers } from "/lib/client";

export default function ReviewsToApprove(data) {
  const reviews = data.results.results;

  const approveReview = (event, version, reviewId) => {
    client
      .execute({
        uri: requestBuilder.reviews.byId(`${reviewId}`).build(),
        method: "POST",
        headers,
        body:     {
          "version": version,
          "actions": [
            {
              "action": "transitionState",
              "state": {
                "key": "approved"
              }
            }
          ]
        }
      })
      .then((result) => {
        console.log({ result });
        window.location.reload();
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>To Approve Reviews</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1> To Approve Reviews </h1>
        <button className="px-4 h-8 uppercase font-semibold tracking-wider border-2 border-black bg-teal-400 text-black">
          <Link href={`/admin/reviews`}>All Reviews</Link>
        </button>
        <div className={styles.grid}>
          {reviews.map(review => 
            <div key={review.id} className={styles.card}>
              <div>Title: {review.title}</div>
              <div>Name: {review.authorName}</div>
              <div className={styles.description}>Review: {review.text}</div>
              <div>Rating: {review.rating}</div>
              {review.state.id =  "7ae261ee-ce3b-416c-bd0c-4b457acfc9fa" ? (
                <button
                  className="px-4 h-8 uppercase font-semibold tracking-wider border-2 border-black bg-teal-400 text-black"
                  onClick={(e) => approveReview(e, review.version, review.id)}
                >
                  Approve
                </button>
              ) : (
                <h1> "Approved" </h1>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
};

export async function getServerSideProps() {
  const toApproveStateId = "7ae261ee-ce3b-416c-bd0c-4b457acfc9fa"
  const results = await client
  .execute({
    uri: requestBuilder.reviews
      .where(
        `state(id = "${toApproveStateId}")`
      )
      .build(),
    method: "GET",
    headers,
  })
  .then((result) => {
    return result.body;
  })
  .catch((error) => {
    console.log({ error });
  });
  return {
    props: {results}
  }
}

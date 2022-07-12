import React, { useEffect, useState } from "react";
import Head from "next/head";
import { client, requestBuilder, headers } from "/lib/client";

export async function getServerSideProps(context) {
    // Fetch Product Reviews
    // hardcoded authorName for now since we don't have a customer object created yet
    // or a current_user's name which could be used as authorName
    const author_name = "Bob Barker"
    const reviews = await client
        .execute({
            uri: requestBuilder.reviews
                .where(
                    `authorName = "${author_name}"`
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
        props: { reviews, author_name },
    };
}

export default function GetReviews({reviews, author_name}) {

  return (
      <div>
        <Head>
          <title>Reviews</title>
        </Head>
        <main>
          <h1>{author_name}&apos;s Reviews</h1>
            <div className="p-8 font-medium">{`Reviews (${reviews?.count || 0})`}</div>

          {reviews.results.map((review) => {
            return (
              <Review review={review}></Review>
            );
          })}
          </main>
      </div>
  );
}

const Review = ({review}) => {
    const [showForm, setShowForm] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        authorName: review.authorName,
        title: review.title,
        text: review.text,
        rating: review.rating,
    });

    const submitForm = (event) => {
        event.preventDefault();

        const formDataParsed = formData;
        formDataParsed.rating = Number(formDataParsed.rating);

        const body = {
          version: review.version,
          actions: [{
            action: 'setAuthorName',
            authorName: formDataParsed.authorName
          }, {
            action: 'setTitle',
            title: formDataParsed.title
          }, {
            action: 'setText',
            text: formDataParsed.text
          }, {
            action: 'setRating',
            rating: formDataParsed.rating
          }]
        }
        client
            .execute({
                uri: requestBuilder.reviews.byId(review.id).build(),
                method: "POST",
                headers,
                body: JSON.stringify(body),
            })
            .then((result) => {
                console.log({ result });
                setReviewSubmitted(true);
                // location reload to refresh page to display updates - will need to refactor to update the formData state
                location.reload()
            })
            .catch((error) => {
                console.log({ error });
            });
    };

    const toggleReviewForm = () => {
        setShowForm(true);
    };

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    return (

        <div
          className="relative flex flex-wrap items-baseline pb-6 pl-6 before:bg-black before:absolute before:-top-6 before:bottom-0 before:-left-60 before:-right-6"
          key={review.id}>
          <h1 className="relative w-full flex-none mb-2 text-2xl font-semibold text-white">
              {review.title}
          </h1>
          <div className="relative text-lg text-white">
              Rating: {review.rating}
          </div>
          <div className="relative uppercase text-teal-400 ml-3">
              Author: {review.authorName}
          </div>
          <p className="relative text-teal-200 ml-3">{review.text}</p>
          <div className="relative uppercase text-teal-400 ml-3">
              {showForm ? (
                  <>
                      {reviewSubmitted ? (
                          <p>Review Submitted!</p>
                      ) : (
                          <form
                              onSubmit={submitForm}
                              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                          >
                              <div className="mb-4">
                                  <label
                                      className="block text-gray-700 text-sm font-bold mb-2"
                                      htmlFor="authorName"
                                  >
                                      Author Name:
                                  </label>
                                  <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      id="authorName"
                                      type="text"
                                      name="authorName"
                                      value={formData.authorName}
                                      onChange={handleInputChange}
                                  />
                              </div>
                              <div className="mb-4">
                                  <label
                                      className="block text-gray-700 text-sm font-bold mb-2"
                                      htmlFor="title"
                                  >
                                      Title:
                                  </label>
                                  <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      id="title"
                                      type="text"
                                      name="title"
                                      value={formData.title}
                                      onChange={handleInputChange}
                                  />
                              </div>
                              <div className="mb-4">
                                  <label
                                      className="block text-gray-700 text-sm font-bold mb-2"
                                      htmlFor="text"
                                  >
                                      Full Review:
                                  </label>
                                  <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      id="text"
                                      type="text"
                                      name="text"
                                      value={formData.text}
                                      onChange={handleInputChange}

                                  />
                              </div>

                              <div className="mb-4">
                                  <label
                                      className="block text-gray-700 text-sm font-bold mb-2"
                                      htmlFor="rating"
                                  >
                                      Rating:
                                  </label>
                                  <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      id="rating"
                                      type="number"
                                      name="rating"
                                      value={formData.rating}
                                      onChange={handleInputChange}
                                  />
                              </div>

                              <input
                                  className="px-6 h-12 uppercase font-semibold tracking-wider border-2 border-black bg-teal-400 text-black"
                                  type="submit"
                                  value="Submit"
                              ></input>
                          </form>
                      )}
                  </>
              ) : (
                  <button
                      className="px-6 h-12 uppercase font-semibold tracking-wider border-2 border-black bg-teal-400 text-black"
                      onClick={toggleReviewForm}
                  >
                      Edit Review
                  </button>
              )}
          </div>
      </div>
  )
};

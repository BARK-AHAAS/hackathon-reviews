import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Products.module.css";
import Link from "next/link";

export default function Products() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [sort, setSort] = useState("reviewRatingStatistics.averageRating asc");
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const productUrl = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/products?sort=${sort}`;
      const response = await fetch(productUrl, {
        method: "get",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CT_ACCESS_TOKEN}`,
        },
      });
      const data = await response.json();
      setData(data);
      setLoading(false);
    };

    fetchData();
  }, [sort, filter]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No products</p>;

  return (
    <div>
      <Head>
        <title>Products</title>
      </Head>

      <main className={styles.productsMain}>
        <h1>Products</h1>

        <label htmlFor="sort">Sort by:</label>
        <select
          name="sort"
          value={sort}
          id="sort-dropdown"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="reviewRatingStatistics.averageRating asc">
            Reviews, ascending
          </option>
          <option value="reviewRatingStatistics.averageRating desc">
            Reviews, descending
          </option>
        </select>

        <label htmlFor="filter">Sort by:</label>
        <select
          name="filter"
          value={filter}
          id="filter-dropdown"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="5.0">Five stars only</option>
          <option value="4.0">Four stars only</option>
        </select>

        <div className={styles.productsList}>
          {data.results.map((item) => {
            console.log(item)
            const currentData = item.masterData.current;
            const masterImage = currentData.masterVariant.images[0];
            return (
              <Link key={item.id} href={`/products/${encodeURIComponent(item.id)}`}>
                <a className={styles.product}>
                  <Image
                    src={masterImage.url}
                    alt="Product"
                    width={200}
                    height={200}
                  />
                  <h3>{currentData.name["en-US"] || currentData.name["en"]}</h3>
                  {item.reviewRatingStatistics?.averageRating && (
                    <h4>
                      {"Average Review: "}
                      {[
                        ...Array(
                          Math.floor(item.reviewRatingStatistics.averageRating)
                        ).keys(),
                      ].map((i) => (
                        <span>&#x2b50;</span>
                      ))}
                    </h4>
                  )}

                  {!item.reviewRatingStatistics?.averageRating && (
                    <h4>No Reviews</h4>
                  )}
                </a>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Products.module.css'

export default function Products({ data }) {
  return (
    <div>
      <Head>
        <title>Products</title>
      </Head>

      <main className={styles.productsMain}>
        <h1>Products</h1>
        <div className={styles.productsList}>
          {data.results.map(item => {
            const currentData = item.masterData.current;
            const masterImage = currentData.masterVariant.images[0];
            return (
              <div className={styles.product}>
                <Image src={masterImage.url} alt="Product" width={200} height={200} />
                <h3>{currentData.name["en-US"] || currentData.name["en"]}</h3>
              </div>
            )
          }
          )}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const headers = {
    "Authorization": `Bearer ${process.env.CT_ACCESS_TOKEN}`
  }
  const myInit = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default',
  };
  const myRequest = new Request(`${process.env.CT_URL}products`);
  const res = await fetch(myRequest, myInit);
  const data = await res.json();
  return {
    props: {data}
  }
}

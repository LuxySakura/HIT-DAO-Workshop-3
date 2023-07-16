import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [descInput, setDescInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/http", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ desc: descInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setDescInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error);
    }
  }

  return (
      <div>
        <Head>
          <title>HIT DAO Workshop #3</title>
          <link rel="icon" href="finn.svg" />
        </Head>

        <main className={styles.main}>
          <img src="stormtrooper.svg" className={styles.icon} />
          <h3>小红书爆款生成助手</h3>
          <form onSubmit={onSubmit}>
            <input
                type="text"
                name="desc"
                placeholder="请输入文案创造的细节"
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
            />
            <input type="submit" value="创造文案" />
          </form>
          <div className={styles.result}>{result}</div>
        </main>

      </div>
  );
}

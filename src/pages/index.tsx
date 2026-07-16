import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Heading from '@theme/Heading'
import HomepageCards from "@site/src/components/HomepageCards";

function HomepageText() {
  return (
    <div className="container homepageContainer margin-bottom--xl">
      <Heading as='h2'>What does Besu support?</Heading>
      <p>
        Besu includes a{" "}
        <Link href="/public-networks/reference/options">
          command line interface
        </Link>{" "}
        and <Link to="/public-networks/how-to/use-besu-api">JSON-RPC API</Link> for
        running, maintaining, debugging, and monitoring nodes in an Ethereum
        network. You can use the API via RPC over HTTP or via WebSocket. Besu
        also supports Pub/Sub.
      </p>
      <p>
        Besu supports common smart contract and dapp development, deployment,
        and operational use cases, using tools such as{" "}
        <Link to="https://github.com/NomicFoundation/hardhat">Hardhat</Link>,{" "}
        <Link to="https://github.com/ethereum/remix">Remix</Link>, and{" "}
        <Link to="https://web3j.io/">web3j</Link>. The client supports common
        JSON-RPC API methods such as <code>eth</code>, <code>net</code>,{" "}
        <code>web3</code>, <code>debug</code>, and <code>miner</code>.
      </p>
      <p>
        Besu doesn&apos;t support key management inside the client. You can use{" "}
        <Link to="https://docs.web3signer.consensys.net/">Web3Signer</Link> with
        Besu to access your keystore and sign transactions.
      </p>

      <Heading as='h2'>Questions?</Heading>
      <p>
        If you have any questions about Besu, ask on the <b>besu</b> channel on{" "}
        <Link to="https://discord.gg/hyperledger">Discord</Link>.
      </p>
      <p>
        You can{" "}
        <Link to="https://lf-hyperledger.atlassian.net/wiki/spaces/BESU/pages/22154225/Documentation">
          contribute to the documentation
        </Link>{" "}
        or to{" "}
        <Link to="https://lf-hyperledger.atlassian.net/wiki/spaces/BESU/pages/22156850/How+to+Contribute">
          Besu itself
        </Link>
        .
      </p>
    </div>
  );
}

export default function Home(): JSX.Element {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Welcome`}>
      <main>
        <HomepageCards />
        <HomepageText />
      </main>
    </Layout>
  );
}

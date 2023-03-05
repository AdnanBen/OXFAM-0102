import { GetServerSideProps } from "next";
import Head from "next/head";
import { Button, Message } from "rsuite";
import styles from "../../styles/Approve.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.query.token) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: { token: context.query.token } };
};

const Approve = ({ token }: { token: string }) => {
  return (
    <>
      <Head>
        <title>Oxfam Survivors Community | Approve moderator</title>
      </Head>

      <main className={styles.container}>
        <Message
          type="info"
          header={
            <strong>
              Are you sure you want to approve this user as a Moderator?
            </strong>
          }
        >
          <Button
            appearance="primary"
            onClick={() => {
              fetch(`/api/adauth/pendingRegistrations/approve/${token}`, {
                method: "POST",
              })
                .then((res) => {
                  if (!res.ok) throw new Error("Failed to approve account");
                  return res;
                })
                .then((res) => res.json())
                .then((res) => {
                  if (!res.success) {
                    throw new Error("Failed to approve account");
                  }

                  window.alert("Account successfully approved!");
                })
                .catch((err) => {
                  console.log(err);
                  window.alert(
                    "There was an error approving the account. Please try again later or contact the administrator if the issue persists"
                  );
                });
            }}
          >
            Yes, approve account.
          </Button>
        </Message>
      </main>
    </>
  );
};

export default Approve;

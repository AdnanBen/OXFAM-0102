import * as React from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FormikProps } from "formik";

import Head from "next/head";
import { t, Trans } from "@lingui/macro";
import { Button } from "rsuite";
import requireSSRTransition from "../../server/requireSSRTransition";
import { GetServerSideProps } from "next";
import styles from "../../styles/Report.module.css";

interface Values {
  name: string;
  situation: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;
  return { props: {} };
};

function FormPage(data: Values) {
  const router = useRouter();

  async function submitForm(data: any) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(
      "/api/reports/completereports/",
      requestOptions
    );
    await response.json();
  }

  const formRef = useRef<FormikProps<any>>(null);

  function listener() {
    console.log("inside unload listener");

    console.log("Incomplete report detected:");
    console.log(formRef.current?.values);
    data = formRef.current?.values;

    let incompleteStr = "";

    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`);
      incompleteStr += `${key}:${value ? "true" : "false"};`;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ reportId: "test", info: incompleteStr });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = fetch("/api/reports/incompletereports/", requestOptions);
  }

  useEffect(() => {
    console.log("useeffect");
    window.addEventListener("beforeunload", listener);
    router.events.on("routeChangeStart", listener);

    return () => {
      console.log("unload");
      window.removeEventListener("beforeunload", listener);
      router.events.off("routeChangeStart", listener);
      console.log("unload done");
    };
  }, []);

  return (
    <>
      <Head>
        <title>OXFAM Survivors Community | Report</title>
      </Head>

      <main className={styles.reportspage}>
        <h3 data-testid="report-header">Make a Report</h3>

        <div className={styles.main_container}>
          <div className={styles.form_container}>
            <Formik
              innerRef={formRef}
              initialValues={{
                name: "",
                situation: "",
              }}
              onSubmit={(
                values: Values,
                { setSubmitting }: FormikHelpers<Values>
              ) => {
                setTimeout(() => {
                  submitForm(values);
                  setSubmitting(false);
                }, 500);
              }}
            >
              <Form>
                <p data-testid="report-name-input">
                  <label htmlFor="firstName">
                    <Trans>Name</Trans>
                    <br />
                    <Field name="name" />
                  </label>
                </p>

                <p data-testid="report-situation-input">
                  <label htmlFor="situation">
                    <Trans>Situation</Trans>
                    <br />
                    <Field name="situation" component="textarea" />
                  </label>
                </p>

                <br />

                <div
                  className={styles.button_container}
                  data-testid="submit-report-btn"
                >
                  <Button type="submit" appearance="primary">
                    <Trans>Submit</Trans>
                  </Button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </main>
    </>
  );
}

export default FormPage;

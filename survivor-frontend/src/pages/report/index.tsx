import * as React from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import router, { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FormikProps } from "formik";

import styles from "../../styles/Report.module.css";
import Head from "next/head";

interface Values {
  name: string;
  gender: string;
  body: string;
}

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
      "http://localhost:3000/reports/completereports/create",
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

    const response = fetch(
      "http://localhost:3000/reports/incompletereports/create",
      requestOptions
    );
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

      <main>
        <div className={`${styles.body}`}>
          <div className={styles.form}>
            <h3>Make a Report</h3>
            <Formik
              innerRef={formRef}
              initialValues={{
                name: "",
                gender: "",
                body: "",
              }}
              onSubmit={(
                values: Values,
                { setSubmitting }: FormikHelpers<Values>
              ) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null));
                  submitForm(values);
                  setSubmitting(false);
                }, 500);
              }}
            >
              <Form>
                <p>
                  <label htmlFor="firstName">Name</label>
                  <br />
                  <Field name="name" />
                </p>

                <p>
                  <label htmlFor="gender">Gender</label>
                  <br />
                  <Field as="select" name="gender">
                    <option value="" label="Select a gender" />
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="O">Other</option>
                  </Field>
                </p>

                <p>
                  <label htmlFor="body">Situation</label>
                  <br />
                  <Field name="body" component="textarea" />
                </p>

                <br />

                <button type="submit">Submit</button>
              </Form>
            </Formik>
          </div>
        </div>
      </main>
    </>
  );
}

export default FormPage;

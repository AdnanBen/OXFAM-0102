import * as React from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FormikProps } from "formik";

import Head from "next/head";
import { t, Trans } from "@lingui/macro";
import { Button } from "rsuite";

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
      "/api/reports/completereports/create",
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
      "/api/reports/incompletereports/create",
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
        <h2>
          <Trans>Make a Report</Trans>
        </h2>

        <div>
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
                <label htmlFor="firstName">
                  <Trans>Name</Trans>
                  <br />
                  <Field name="name" />
                </label>
              </p>

              <p>
                <label htmlFor="gender">
                  <Trans>Gender</Trans>
                  <br />
                  <Field as="select" name="gender">
                    <option value="" label={t`Select a gender`} />
                    <option value="M">
                      <Trans>Male</Trans>
                    </option>
                    <option value="F">
                      <Trans>Female</Trans>
                    </option>
                    <option value="O">
                      <Trans>Other</Trans>
                    </option>
                  </Field>
                </label>
              </p>

              <p>
                <label htmlFor="body">
                  <Trans>Situation</Trans>
                  <br />
                  <Field name="body" component="textarea" />
                </label>
              </p>

              <br />

              <Button type="submit" appearance="primary">
                <Trans>Submit</Trans>
              </Button>
            </Form>
          </Formik>
        </div>
      </main>
    </>
  );
}

export default FormPage;

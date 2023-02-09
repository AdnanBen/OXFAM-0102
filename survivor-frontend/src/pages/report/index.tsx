import * as React from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import router, { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FormikProps } from "formik";

import styles from "../../styles/Report.module.css";

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
      "http://localhost/api/reports/completereports/create",
      requestOptions
    );
    await response.json();
  }

  const formRef = useRef<FormikProps<any>>(null);

  function listener() {
    console.log("Incomplete report detected:");
    console.log(formRef.current?.values);
    data = formRef.current?.values;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = fetch(
      "http://localhost/api/reports/incompletereports/create",
      requestOptions
    );
  }

  useEffect(() => {
    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, []);

  return (
    <div className={`${styles.body}`}>
      <div className={styles.form}>
        <h1>Make a Report</h1>
        <Formik
          innerRef={formRef}
          initialValues={{
            name: "",
            gender: "M",
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
              <label htmlFor="email">Gender</label>
              <br />
              <Field as="select" name="gender">
                <option value="male">M</option>
                <option value="female">F</option>
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
  );
}

export default FormPage;

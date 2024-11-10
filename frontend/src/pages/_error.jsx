import React from "react";
import Link from "next/link";
import Head from "next/head";


export default function () {
  return (
    <>
      <Head>
        <title>Error</title>
      </Head>
      <div className="error-404">
        <div className="container-full-half">
          <div className="row">
            <div className="col-12 col-md-7">
              <div className="error-404__content">
                <h2>Oops!</h2>
                <h5>404 PAGE NOT FOUND</h5>
                <p>
                  This page couldn't be found! Back to home page if you like.
                  Please use search for help!
                </p>
                <div className="form-wrapper">
                 
                  <Button
                    action={process.env.PUBLIC_URL + "/"}
                    className="-underline"
                    color="transparent"
                    content="Back to homepage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

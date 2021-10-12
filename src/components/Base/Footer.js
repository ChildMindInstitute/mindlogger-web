import React from 'react'

export const Footer = () => {
  return (
    <footer className="d-flex justify-content-center align-items-center bg-light footer">
      <p className="mt-3 text-center">
        <img
          className="logo mr-1"
          src="https://27c2s3mdcxk2qzutg1z8oa91-wpengine.netdna-ssl.com/wp-content/themes/childmind/assets/img/cmi-logo-vert-ko.svg"
        />
        ©{' '}
        <a
          href="https://childmind.org"
          className="mx-1"
          target={'_blank'}
          rel="noreferrer"
        >
          {' '}
          Child Mind Institute{' '}
        </a>{' '}
        MATTER Lab 2021
      </p>
    </footer>
  )
}
export default Footer

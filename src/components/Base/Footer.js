import React from 'react'

export const Footer = () => {
  return (
    <footer className="d-flex justify-content-center align-items-center bg-light footer">
      <p className="mt-3 text-center d-flex align-items-center">
        <img
          className="logo mr-1"
          src="https://cmi-logos.s3.amazonaws.com/ChildMindInstitute_Logo_Horizontal_RGB.png"
        />
        {'© '}
        <a
          href="https://childmind.org"
          className="mx-1"
          target={'_blank'}
          rel="noreferrer"
        >
          {' '}
          Child Mind Institute{' '}
        </a>{' '}
        MATTER Lab 2022

        <a className="mx-4" href="https://mindlogger.org/terms" target='_blank'>Terms of Service</a>
      </p>
    </footer>
  )
}
export default Footer

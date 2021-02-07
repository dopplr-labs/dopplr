import React from 'react'
import './spinner.css'

export default function Spinner() {
  return (
    <div className="relative flex items-center justify-center p-2 loader-container">
      <svg viewBox="0 0 27 32" fill="none" className="w-16 hexagon">
        <path
          d="M13.1119 26.8352L13.1098 26.834V26.8352L4.63642 21.6074L4.45923 21.7326L4.25251 21.8579L0 24.4247L13.1119 32.0001L26.2238 24.4247L21.8532 21.6074L13.1119 26.8352Z"
          fill="#167391"
        />
        <path
          d="M21.8555 10.9342V21.6271L26.2207 24.421V8.14026L13.5098 0V5.59085L21.8555 10.9342Z"
          fill="#15A4F5"
        />
        <path
          d="M0.0102167 24.4173L4.64194 21.6271L4.6451 21.6225V10.9342L13.5093 5.5944V5.59085V0.00380402V0L0.00390625 8.14026V24.421L0.0102167 24.4173Z"
          fill="#2DCCEF"
        />
      </svg>
      <div className="box-container">
        <div className="box">
          <div className="face face--is-front" />
          <div className="face face--is-back" />
          <div className="face face--is-top">&nbsp;</div>
          <div className="face face--is-bottom">&nbsp;</div>
          <div className="face face--is-left" />
          <div className="face face--is-right" />
        </div>
      </div>
    </div>
  )
}

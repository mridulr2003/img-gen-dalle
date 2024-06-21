
import type { AppProps } from "next/app";
import "./App.css"
import OpenAI from "openai";
import getConfig from "next/config";
import { useState, useEffect } from "react";
import { setDefaultResultOrder } from "dns";

export default function App({ Component, pageProps }: AppProps) {

  const [result, setResult] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ51LlmfWrYtKXyASAzeq6Ih-mO_N6dvk7cWg&s");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const text = "Creating Image...Please Wait...";
  
  const { publicRuntimeConfig } = getConfig();

  // Debugging statements
  // console.log('publicRuntimeConfig:', publicRuntimeConfig);
  //console.log('process.env.OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

  // const apiKey = (typeof publicRuntimeConfig !== 'undefined' && publicRuntimeConfig.apiKey) ? publicRuntimeConfig.apiKey : process.env.OPENAI_API_KEY;

  // if (!apiKey) {
  //   throw new Error('apiKey is not defined in config file')
  // }

  //console.log("WOAH")
  //console.log(apiKey)

  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
  // });

  const act = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const openai = new OpenAI({
    apiKey: act,
    dangerouslyAllowBrowser: true // This is the default and can be omitted
  });
  
  const generateImage = async () => {
    setLoading(true);
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: '512x512',
    });
    setLoading(false);
    const imageUrl = response.data[0].url;
    const data = response.data;
    //console.log(data);
    setResult(imageUrl || 'no image found');
  }

  useEffect(() => {
    if (loading) {
      let i = 0;
      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if (i > text.length + 1) {
          i = 0;
          setTypedText('');
        }
      }, 100);
      return () => clearInterval(typing);
    }

  }, [loading])

  const sendEmail = (url = "") => {
    url = result;
    const message = `Here's your image download link ${url}`;
    window.location.href = `mailto:someone@example.co?subject=Image Download Link&body=${message}`;
  }
  
  return <div className = "app-main">
  <h2>
    The World is Your Canvas
  </h2>
  <textarea
  className = "app-input"
  placeholder = "Create any type of image you can think of with as much added description as you like"
  onChange={(e)=> setPrompt(e.target.value)}
  />
  <button onClick={generateImage}> Generate Image</button>
  <>{loading ? (
    <>
    <h3>{typedText}</h3>
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
    </>
  )
  :<img src = {result} onClick = {() => sendEmail(result)} style = {{cursor: "pointer"}} className = "result-image" alt = "result" />
  }
  </>
  </div>;
}

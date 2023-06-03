import {ChangeEvent, useState} from 'react';

function ServiceRequest() {

    const [inputText, setInputText] = useState("test prompt");

    function handleInput(e: ChangeEvent<HTMLInputElement>) {
        setInputText(e.target.value);
    }

    return (
    <>
      <h1>Computer Service</h1>
        <div className="label-container">
            <label>Location:</label>
            <input value={inputText} onChange={handleInput} />
        </div>
        <div>
      <a href={`/`}>
        <button className={"button"}>Return Home</button>
      </a>
        </div>
    </>
  );
}

export default ServiceRequest;

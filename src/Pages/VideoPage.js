import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import ReactSelect from "react-select";
import MicRecorder from "mic-recorder-to-mp3";

import unMute from "../assests/unMute.png";
import mute from "../assests/mute.png";
import audioGif from "../assests/sound.gif";
import { supportedLanguage } from "../util/util";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const initialAudio = {
  isRecording: false,
  blobURL: "",
  isBlocked: false,
};

function VideoPage() {
  const [start, setStart] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [voiceData, setVoiceData] = useState("");
  const [audio, setAudio] = useState({ ...initialAudio });

  const { state } = useLocation();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        setAudio({ ...audio, isBlocked: false });
      },
      () => {
        console.log("Permission Denied");
        setAudio({ ...audio, isBlocked: true });
      }
    );
  }, []);

  useEffect(() => {
    setVoiceData(transcript);
  }, [transcript]);

  useEffect(() => {
    axios(
      `https://asia-south1-checko-backend-staging-344809.cloudfunctions.net/corteve-data-logging?location=${{
        ...state.userData.location,
      }}&phone_number=${state.userData.mobile}`
    ).then((res) => {
      console.log(res.data);
    });
  }, []);

  // if (!browserSupportsSpeechRecognition) {
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }

  const startRecord = () => {
    if (audio.isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setAudio({ ...audio, isRecording: true });
        })
        .catch((e) => console.error(e));
    }
  };

  const stopRecord = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setAudio({ ...audio, blobURL, isRecording: false });
        const audioReader = new FileReader();
        audioReader.readAsDataURL(blob);
        audioReader.onloadend = () => {
          console.log(
            audioReader.result.substr(audioReader.result.indexOf(", ") + 1)
          );
          const finalAudio = {
            // content: audioReader.result.substr(
            //   audioReader.result.indexOf(", ") + 1
            // ),
            content: "",
          };
          const config = {
            encoding: "LINEAR16",
            sampleRateHertz: 16000,
            languageCode: "en-US",
          };
          const request = {
            audio: finalAudio,
            config: config,
          };
          axios
            .request({
              url: "https://speech.googleapis.com/v1/speech:recognize/?key=",
              // url: `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.googleApiKey}`,

              method: "POST",
              data: request,
            })
            .then((response) => {
              const transcription = response.data.results
                .map((result) => result.alternatives[0].transcript)
                .join("\n");
              console.log(`Transcription: ${transcription}`);
            })
            .catch((err) => {
              console.log("err :", err);
            });
        };
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="video-display">
      <audio
        style={{ display: "none" }}
        src={audio.blobURL}
        controls="controls"
      />
      <div className="input-container">
        <ReactSelect
          isClearable={true}
          isSearchable={true}
          onChange={(val) => setLanguage(val.value)}
          className="language-select ml-2"
          options={[...supportedLanguage]}
          width="300px"
        />
        <div>
          {!start ? (
            <img
              onClick={() => {
                setStart(true);
                startRecord();
              }}
              src={mute}
              alt="mic"
              className="icon input-icon"
            />
          ) : (
            <img
              onClick={() => {
                setStart(false);
                stopRecord();
              }}
              src={unMute}
              alt="mic"
              className="icon input-icon"
            />
          )}
          <input
            className="input search-bar"
            onChange={(e) => setVoiceData(e.target.value)}
            value={voiceData}
          />
        </div>
      </div>
      <div className="micro-phone-container mb-2">
        {start && (
          <div className="d-flex-row flex-col hor-center mt-2 mb-2">
            <img className="big-icon" alt="audioGif" src={audioGif} />
          </div>
        )}
      </div>

      <div className="video-container">
        <video
          autoPlay={true}
          muted={true}
          src="https://storage.googleapis.com/staging.jkwebpage-96e5b.appspot.com/corteva_english_hyd.mp4"
          controls
        />
      </div>
    </div>
  );
}

export default VideoPage;

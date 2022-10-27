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

const reader = new FileReader();

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
    navigator.mediaDevices.getUserMedia(
      { audio: true },
      (stream) => {
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

  reader.onload = () => {
    const arrayBuffer = reader.result;
    const audio = window.btoa(arrayBuffer);
    const finalAudio = {
      content: audio,
    };

    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 44100,
      languageCode: "en-US",
      audioChannelCount: 2,
      enableAutomaticPunctuation: false,
      enableSeparateRecognitionPerChannel: false,
      enableSpokenEmojis: false,
      enableSpokenPunctuation: false,
      enableWordConfidence: false,
      enableWordTimeOffsets: false,
      maxAlternatives: 2,
      profanityFilter: false,
      useEnhanced: true,
    };
    const request = {
      audio: finalAudio,
      config: config,
    };
    axios
      .request({
        url: "https://speech.googleapis.com/v1/speech:recognize/?key=",
        method: "POST",
        data: request,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log("err :", err);
      });
  };

  const stopRecord = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        console.log(buffer, blob);
        reader.readAsBinaryString(blob);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="video-display">
      <audio src={audio.blobURL} controls="controls" />
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
          // autoPlay='{true}
          muted={true}
          src="https://storage.googleapis.com/staging.jkwebpage-96e5b.appspot.com/corteva_english_hyd.mp4"
          controls
        />
      </div>
    </div>
  );
}

export default VideoPage;

import React, { useEffect, useState } from "react";
import "./question.less";
import { StoryQuestion, StoryQuestionType } from "../../../nervape/story";
import { Checkbox, Radio } from "antd";

export default function StoryQuestionPop(props: { show: boolean; questions: StoryQuestion[]; signInWithEthereum: Function; close: Function; openGalxeUrl: Function; }) {
    const { show, questions, signInWithEthereum, close, openGalxeUrl } = props;
    const [currIndex, setCurrIndex] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [errorMessage, setErrprMessage] = useState('');
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (!questions.length) return;
        let _answers: any[] = [];
        questions.forEach(() => _answers.push({
            value: ''
        }))
        setAnswers(_answers);
        setCurrIndex(0);
    }, [questions, show]);
    const BackButton = () => {
        return (
            <button
                className="btn back-btn button-hover-action-red cursor"
                onClick={() => {
                    setErrprMessage('');
                    answers[currIndex - 1].value = "";
                    setCurrIndex(currIndex - 1);
                }}>
                BACK
            </button>
        );
    }

    const checkAnswer = async () => {
        if (questions[currIndex].type == StoryQuestionType.Radio) {
            if (answers[currIndex].value !== questions[currIndex].optionId) {
                setErrprMessage(questions[currIndex].errorMessage || 'Wrong answer. Don’t give up! Try again.');
                return false;
            }
        }

        if (questions[currIndex].type == StoryQuestionType.Checkbox) {
            if (!answers[currIndex].value || questions[currIndex].optionId != answers[currIndex].value.join(',')) {
                setErrprMessage(questions[currIndex].errorMessage || 'Wrong answer. Don’t give up! Try again.');
                return false;
            }
        }

        setErrprMessage('');
        return true;
    }
    const NextButton = () => {
        return (
            <button
                className="btn next-btn button-hover-action-red cursor"
                onClick={async () => {
                    const pass = await checkAnswer();
                    if (!pass) return;
                    if (currIndex == questions.length - 1) {
                        // Check and Submit
                        const data = await signInWithEthereum();
                        // console.log('signInWithEthereum', data);
                        setCompleted(true);
                    } else {
                        setCurrIndex(currIndex + 1);
                    }
                }}>
                {currIndex == questions.length - 1 ? 'SUBMIT' : 'NEXT'}
            </button>
        );
    }

    return (
        <div className={`story-quiz-container ${show && 'show'}`} onClick={() => { close() }}>
            <div className="story-quiz-content" onClick={e => { e.stopPropagation(); }}>
                <div className="question-content">
                    <div className="question-top">
                        <div className="quiz-index">{completed ? 'Quiz Completed' : `Question ${currIndex + 1} of ${questions.length}`}</div>
                        {!completed && (
                            <>
                                {questions[currIndex].coverImage && (
                                    <div className="cover-image">
                                        <img src={questions[currIndex].coverImage} alt="CoverImage" />
                                    </div>
                                )}
                                <div className="question-title">{questions[currIndex].title}</div>
                            </>
                        )}
                    </div>
                    <div className="question-center">
                        {!completed ? (
                            <>
                                <div className="question-options">
                                    {questions[currIndex].type == StoryQuestionType.Radio && (
                                        <Radio.Group
                                            options={questions[currIndex].options}
                                            optionType="button"
                                            onChange={(e) => {
                                                let _answers = JSON.parse(JSON.stringify(answers));
                                                _answers[currIndex].value = e.target.value;
                                                setAnswers(_answers);
                                            }}>
                                        </Radio.Group>
                                    )}
                                    {
                                        questions[currIndex].type == StoryQuestionType.Checkbox && (
                                            <Checkbox.Group
                                                options={questions[currIndex].options}
                                                onChange={(e) => {
                                                    let _answers = JSON.parse(JSON.stringify(answers));
                                                    _answers[currIndex].value = e;
                                                    setAnswers(_answers);
                                                }}>
                                            </Checkbox.Group>
                                        )
                                    }
                                </div>
                                {errorMessage && (
                                    <div className="error-message">{errorMessage}</div>
                                )}
                            </>
                        ) : (
                            <div className="completed-content">
                                <img className="completed-img" alt="" />
                                <div className="completed-tip">
                                    Congratulations! You have completed the Nervape Saga Challenge. 
                                    You can now claim your reward!
                                </div>
                            </div>
                        )}
                    </div>

                    {!completed ? (
                        <div className="btn-groups">
                            {currIndex > 0 && BackButton()}
                            {NextButton()}
                        </div>
                    ) : (
                        <div className="claim-reward">
                            <button className="btn button-hover-action-red cursor"
                                onClick={() => {
                                    openGalxeUrl();
                                }}>CLAIM REWARD</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import "./question.less";
import { StoryQuestion, StoryQuestionType, StoryQuestionVerifyResult } from "../../../nervape/story";
import { Checkbox, Radio } from "antd";
import { queryOatPoapInfo } from "../../../utils/api";

export default function StoryQuestionPop(
    props: { 
        show: boolean; 
        questions: StoryQuestion[]; 
        close: Function; 
        openGalxeUrl: Function; 
        isCompleteChallenge: boolean;
        showCompleteChallenge: Function;
        verifyResult: StoryQuestionVerifyResult | undefined;
    }) {
    const { 
        show,
        questions,
        close,
        openGalxeUrl,
        showCompleteChallenge,
        isCompleteChallenge,
        verifyResult } = props;
    const [currIndex, setCurrIndex] = useState(0);
    const [completeIndex, setCompleteIndex] = useState(1);
    const [answers, setAnswers] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!questions.length) return;
        let _answers: any[] = [];
        questions.forEach(() => _answers.push({
            value: ''
        }))
        setAnswers(_answers);
        setCurrIndex(0);
        setCompleteIndex(1);
        setErrorMessage('');
    }, [questions, show]);

    const BackButton = () => {
        return (
            <button
                className="btn back-btn button-hover-action-red cursor"
                onClick={() => {
                    setErrorMessage('');
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
                setErrorMessage(questions[currIndex].errorMessage || 'Wrong answer. Don’t give up! Try again.');
                return false;
            }
        }

        if (questions[currIndex].type == StoryQuestionType.Checkbox) {
            if (!answers[currIndex].value || questions[currIndex].optionId != answers[currIndex].value.join(',')) {
                setErrorMessage(questions[currIndex].errorMessage || 'Wrong answer. Don’t give up! Try again.');
                return false;
            }
        }

        setErrorMessage('');
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
                        // console.log('signInWithEthereum', data);
                        showCompleteChallenge(true);
                    } else {
                        setCurrIndex(currIndex + 1);
                    }
                }}>
                NEXT
            </button>
        );
    }

    const completeCover = () => {
        if (verifyResult?.lockAsset && completeIndex == 1) {
            return verifyResult?.asset?.url;
        }
        return verifyResult?.oat;
    }

    const completeDesc = () => {
        if (verifyResult?.lockAsset) {
            return completeIndex == 1 
                ? 'Congratulations! You have completed this challenge and received the SagaOnly Asset. You can view the asset in your wallet -> NACP -> Asset tab' 
                : 'You can now claim the Story Oat.';
        }
        return 'Congratulations! You have completed this challenge and received the SagaOnly Asset. You can now claim the Story Oat.';
    }

    return (
        <div className={`story-quiz-container popup-container ${show && 'show'}`} onClick={() => { close() }}>
            <div className="story-quiz-content" onClick={e => { e.stopPropagation(); }}>
                <div className="question-content">
                    <div className="question-top">
                        <div className="quiz-index">{isCompleteChallenge 
                            ? `Claim Reward ${verifyResult?.lockAsset ? completeIndex + ' of 2' : ''}` 
                            : `Question ${currIndex + 1} of ${questions.length}`}</div>
                        {!isCompleteChallenge && (
                            <>
                                {questions[currIndex]?.coverImage && (
                                    <div className="cover-image">
                                        <img src={questions[currIndex]?.coverImage} alt="CoverImage" />
                                    </div>
                                )}
                                <div className="question-title">{questions[currIndex]?.title}</div>
                            </>
                        )}
                    </div>
                    <div className="question-center">
                        {!isCompleteChallenge ? (
                            <>
                                <div className="question-options">
                                    {questions[currIndex]?.type == StoryQuestionType.Radio && (
                                        <Radio.Group
                                            options={questions[currIndex].options}
                                            value={answers[currIndex]?.value}
                                            optionType="button"
                                            onChange={(e) => {
                                                let _answers = JSON.parse(JSON.stringify(answers));
                                                _answers[currIndex].value = e.target.value;
                                                setAnswers(_answers);
                                            }}>
                                        </Radio.Group>
                                    )}
                                    {
                                        questions[currIndex]?.type == StoryQuestionType.Checkbox && (
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
                                <img className="completed-img" src={completeCover()} alt="" />
                                <div className="completed-tip">{completeDesc()}</div>
                            </div>
                        )}
                    </div>

                    {!isCompleteChallenge ? (
                        <div className="btn-groups">
                            {currIndex > 0 && BackButton()}
                            {NextButton()}
                        </div>
                    ) : (
                        <div className="claim-reward">
                            <button className="btn button-hover-action-red cursor"
                                onClick={() => {
                                    if (verifyResult?.lockAsset && completeIndex == 1) {
                                        setCompleteIndex(2);
                                    } else {
                                        openGalxeUrl();
                                    }
                                }}>{verifyResult?.lockAsset && completeIndex == 1 ? 'NEXT' : 'CLAIM OAT'}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

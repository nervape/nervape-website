import React, { useEffect, useState } from "react";
import './index.less';

import LandingBanner from '../../assets/landing-page/banner.png';
import DownArrow from '../../assets/landing-page/arrow_down.svg';
import UpArrowIcon from '../../assets/landing-page/up_arrow.svg';
import { Question } from "../../nervape/composite";
import { PfpMocks } from "../../mock/composite-mock";
import Footer from "../components/footer";

export default function Composite() {
    const [showLandingPage, setShowLandingPage] = useState(false);
    const [showBoneList, setShowBoneList] = useState(true);
    const [godwokenAddress, setGodwokenAddress] = useState('');

    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const [introItems, setIntroItems] = useState<{ title: String, desc: String }[]>([]);

    const [questions, setQuestions] = useState<Question[]>([]);

    const IntroItem = (props: { item: any; }) => {
        const { item } = props;
        return (
            <div className="intro-item">
                <img className="intro-img" alt="" />
                <div className="intro-title">Assemble Your Own PFP</div>
                <div className="intro-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            </div>
        );
    }

    useEffect(() => {
        setShowLandingPage(true);
        setIntroItems([
            {
                title: '',
                desc: ''
            },
            {
                title: '',
                desc: ''
            },
            {
                title: '',
                desc: ''
            }
        ]);
        const _questions = PfpMocks.fnGetQuestions();
        setQuestions(_questions);
    }, []);

    return (
        <div className="home-page">
            {showLandingPage && (
                <div className="landing-page">
                    <section className="banner-section">
                        <img className="banner" src={LandingBanner} alt="" />
                        <img src={DownArrow} className="cursor down-arrow"
                            onClick={() => {
                                window.scrollTo({
                                    top: window.innerHeight,
                                    behavior: 'smooth'
                                })
                            }} alt="" />
                    </section>
                    <section className="composite-section">
                        <div className="nervape-composite">
                            <div className="composite">
                                <div className="title">NERVAPE COMPOSITE</div>
                            </div>
                            {showBoneList && (
                                <div className="bone-list">
                                    <div className="title">Bonelist Lookup</div>
                                    <div className="address-input">
                                        <input type="text" value={godwokenAddress} onInput={(e: any) => {
                                            setGodwokenAddress(e.target.value)
                                        }} placeholder="Godwoken address" />
                                        <button className="check-btn cursor">CHECK</button>
                                    </div>
                                    <div className="tip">
                                        To be notified as soon as we go live... Join Our <a className="cursor" href="https://discord.com/invite/7br6nvuNHP" target="_blank" rel="noopener noreferrer">Discord</a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="intro-items">
                            {introItems.map((item, index) => {
                                return <IntroItem key={index} item={item}></IntroItem>;
                            })}
                        </div>
                    </section>
                    <section className="qa-section">
                        <div className="qa-content">
                            <h3 className="title">Q&A</h3>
                            <div className="questions">
                                {questions.length ? (
                                    questions.map((question, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`question cursor ${question.open && 'open'}`}
                                                style={{ background: question.background }}
                                                onMouseDown={(e) => {
                                                    console.log('down', e)
                                                    setClickPosition({ x: e.clientX, y: e.clientY })
                                                }}
                                                onMouseUp={(e) => {
                                                    console.log('up', e)
                                                    if (e.clientX == clickPosition.x && e.clientY == clickPosition.y) {
                                                        let _questions = JSON.parse(JSON.stringify(questions));
                                                        _questions.map((q: any, i: number) => {
                                                            if (i !== index) {
                                                                q.open = false;
                                                            }
                                                            return q;
                                                        })
                                                        _questions[index].open = !_questions[index].open;
                                                        setQuestions(_questions);
                                                    }
                                                    setClickPosition({ x: 0, y: 0 })
                                                }}
                                            >
                                                <div className="hover-cover"></div>
                                                <div
                                                    className="arrow"
                                                >
                                                    <img loading="lazy" src={UpArrowIcon} alt="UpArrowIcon" />
                                                </div>
                                                <div className="q">
                                                    <div className="q-l">Q:</div>
                                                    <div className="q-r">{question.question}</div>
                                                </div>
                                                {question.open ? (
                                                    <div className="a">
                                                        <div className="a-l">A:</div>
                                                        <div className="a-r" dangerouslySetInnerHTML={{ __html: question.answer }}></div>
                                                    </div>
                                                ) : ''}
                                            </div>
                                        );
                                    })
                                ) : ''}
                            </div>
                        </div>
                        <Footer></Footer>
                    </section>
                </div>
            )}
        </div>
    );
}

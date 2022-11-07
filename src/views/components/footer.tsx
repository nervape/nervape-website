import React, { useContext, useEffect, useState } from 'react';
import { DataContext, getWindowWidthRange } from '../../utils/utils';
import './footer.less';

export default function Footer() {
    const [isMobile, setIsMobile] = useState(false);
    const { windowWidth } = useContext(DataContext);

    useEffect(() => {
        setIsMobile(!(windowWidth !== 375));
    }, [windowWidth]);
    
    return (
        <div className={`footer ${isMobile && 'mobile'}`}>
            <div className="copy">@&nbsp;2022&nbsp;&nbsp;Nervape</div>
            <div className="footer-item">
                <div className="wiki">Nervape Wiki</div>
                <div className="brand-assets">
                  <a href="https://tourmaline-elderberry-f93.notion.site/Nervape-Brand-Assets-b7c52ca6f17c492e87cd18b5496da8f0">
                    Brand Assets
                  </a>
                </div>
                <div className="contact-us">
                    <a href="mailto:creative@nervape.com">Contact Us</a>
                </div>
            </div>
        </div>
    );
}

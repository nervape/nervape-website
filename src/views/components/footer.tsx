import React, { useEffect, useState } from 'react';
import { getWindowWidthRange } from '../../utils/utils';
import './footer.less';

export default function Footer() {
    const widthRange = getWindowWidthRange();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(!(widthRange !== 375));
    }, []);
    return (
        <div className={`footer ${isMobile && 'mobile'}`}>
            <div className="copy">@2022 Nervape</div>
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

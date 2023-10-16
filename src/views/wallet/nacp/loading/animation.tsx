import React, { useRef, useEffect } from 'react';
import lottie from 'lottie-web';
import classNames from 'classnames';

const Animation = ({ className, visible = true, style, animationData, onInit }) => {
    const el = useRef(null);
    const animationInstances = useRef(null);

    function init() {
        if (!animationData) return;

        animationInstances.current = null;
        if (typeof animationData === 'function') {
            animationData().then(initAnimate);
        } else {
            initAnimate(animationData);
        }

        function initAnimate(animationData) {
            (animationInstances.current as unknown) = lottie.loadAnimation({
                container: (el.current as unknown as HTMLElement),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData,
            });

            // eslint-disable-next-line no-unused-expressions
            onInit?.(animationInstances.current);
        }
    }

    useEffect(() => {
        if (!visible) return;

        init();

        return () => {
            // eslint-disable-next-line no-unused-expressions
            (animationInstances.current as any)?.destroy?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (animationInstances.current || !visible) return;

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    return (
        <div
            ref={el}
            style={{ visibility: !visible && 'hidden', ...style }}
            className={classNames('lottie-animate', className)}
        ></div>
    );
};

export default Animation;


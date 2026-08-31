import { Button, Heading, IconLib, Logo, Text, View } from '@fold-ui/core'
import React from 'react'

export default {
    title: 'Templates/Hero',
    excludeStories: 'docs',
    parameters: {
        layout: 'fullscreen',
        fold: { bare: true },
    },
}

export const docs = {
    title: 'Hero template',
    subtitle: 'A polished marketing hero composed from Fold primitives and design tokens.',
    description:
        'Use this template as a starting point for a product landing page. It combines a compact navigation bar, focused headline, supporting copy, primary action, and decorative product tiles in one copyable Storybook recipe.',
}

/**
 * A desktop-first landing-page hero inspired by data and AI products.
 * The decorative artwork is CSS-only, so the template has no image dependencies.
 */
export const DataPlatform = () => {
    const navigation = ['Why Fold', 'Product', 'Solutions', 'Resources', 'About']

    const BrandGlyph = ({ kind }: { kind: 'orbit' | 'bars' | 'path' | 'bow' | 'stack' }) => {
        if (kind === 'orbit') {
            return (
                <span className="fold-template-glyph fold-template-glyph--orbit">
                    <i />
                    <i />
                    <i />
                    <i />
                </span>
            )
        }

        if (kind === 'bars') {
            return (
                <span className="fold-template-glyph fold-template-glyph--bars">
                    <i />
                    <i />
                    <i />
                </span>
            )
        }

        if (kind === 'path') {
            return (
                <span className="fold-template-glyph fold-template-glyph--path">
                    <i />
                </span>
            )
        }

        if (kind === 'bow') {
            return (
                <span className="fold-template-glyph fold-template-glyph--bow">
                    <i />
                    <i />
                </span>
            )
        }

        return (
            <span className="fold-template-glyph fold-template-glyph--stack">
                <i />
                <i />
                <i />
            </span>
        )
    }

    const ProductTile = ({
        kind,
        position,
    }: {
        kind: 'orbit' | 'bars' | 'path' | 'bow' | 'stack'
        position: string
    }) => (
        <View
            className={`fold-template-tile fold-template-tile--${position}`}
            aria-hidden="true">
            <BrandGlyph kind={kind} />
        </View>
    )

    return (
        <View className="fold-template-hero">
            <style>{`
                .fold-template-hero,
                .fold-template-hero * {
                    box-sizing: border-box;
                }

                .fold-template-hero {
                    --template-ink: #09090b;
                    --template-muted: #6f7078;
                    --template-blue: #2784f7;
                    --template-pink: #fa358c;
                    --template-yellow: #ffca21;
                    --f-color-accent: var(--template-blue);
                    --f-color-accent-text: #ffffff;
                    position: relative;
                    min-height: 500px;
                    height: 100vh;
                    max-height: 760px;
                    overflow: hidden;
                    isolation: isolate;
                    color: var(--template-ink);
                    background:
                        radial-gradient(circle at 50% 42%, rgba(232, 241, 255, 0.42), transparent 24%),
                        linear-gradient(180deg, #ffffff 0%, #ffffff 62%, #fafcff 100%);
                }

                .fold-template-shell {
                    position: relative;
                    z-index: 3;
                    width: min(100% - 40px, 1120px);
                    margin: 0 auto;
                    padding-top: 16px;
                }

                .fold-template-nav {
                    display: flex;
                    align-items: center;
                    width: min(100%, 720px);
                    height: 44px;
                    margin: 0 auto;
                    padding: 4px 6px 4px 18px;
                    border: 1px solid #e9e9ed;
                    border-radius: 17px;
                    background: rgba(255, 255, 255, 0.92);
                    box-shadow: 0 3px 11px rgba(20, 25, 40, 0.08);
                    backdrop-filter: blur(16px);
                }

                .fold-template-brand.f-text.is-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--template-ink);
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    white-space: nowrap;
                }

                .fold-template-nav__links {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    flex: 1;
                    margin: 0 20px;
                }

                .fold-template-nav__link.f-text.is-link {
                    text-decoration: none;
                    white-space: nowrap;
                }

                .fold-template-nav__actions {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }

                .fold-template-search,
                .fold-template-locale {
                    display: grid;
                    place-items: center;
                    width: 32px;
                    height: 32px;
                    flex: 0 0 32px;
                    border: 1px solid #eeeeef;
                    border-radius: 50%;
                    color: var(--template-ink);
                    background: #ffffff;
                }

                .fold-template-locale {
                    border-color: transparent;
                    font-size: 18px;
                    line-height: 1;
                }

                .fold-template-nav__cta.f-button {
                    min-width: 118px;
                    height: 34px;
                    border: 0;
                    border-radius: 12px;
                    color: #ffffff;
                    background: var(--template-ink);
                    box-shadow: none;
                    --f-text-color: #ffffff;
                }

                .fold-template-content {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    width: min(100%, 680px);
                    margin: 26px auto 0;
                    text-align: center;
                }

                .fold-template-title.f-heading {
                    max-width: 650px;
                    margin: 0;
                    color: var(--template-ink);
                    font-size: clamp(48px, 5.1vw, 72px);
                    font-weight: 780;
                    line-height: 0.98;
                    letter-spacing: -0.065em;
                }

                .fold-template-highlight {
                    display: inline-block;
                    margin-left: 0.06em;
                    padding: 0.01em 0.11em 0.08em;
                    border-radius: 7px;
                    background: var(--template-yellow);
                    box-decoration-break: clone;
                    -webkit-box-decoration-break: clone;
                }

                .fold-template-subtitle.f-text {
                    max-width: 470px;
                    margin: 16px 0 0;
                    color: var(--template-muted);
                    font-size: 14px;
                    line-height: 1.55;
                }

                .fold-template-primary.f-button {
                    height: 48px;
                    margin-top: 16px;
                    padding: 0 20px;
                    border: 0;
                    border-radius: 10px;
                    color: #ffffff !important;
                    background-color: var(--template-blue) !important;
                    box-shadow: 0 9px 24px rgba(39, 132, 247, 0.22);
                    --f-text-color: #ffffff;
                }

                .fold-template-primary .f-button__suffix {
                    display: grid;
                    place-items: center;
                    width: 19px;
                    height: 19px;
                    margin-left: 2px;
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                }

                .fold-template-primary .f-button__suffix svg {
                    width: 11px;
                    height: 11px;
                }

                .fold-template-art {
                    position: absolute;
                    z-index: 1;
                    inset: 0;
                    pointer-events: none;
                }

                .fold-template-art::after {
                    position: absolute;
                    z-index: 4;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    height: 92px;
                    content: '';
                    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.88));
                }

                .fold-template-tile {
                    position: absolute;
                    display: grid;
                    place-items: center;
                    width: 154px;
                    height: 154px;
                    border: 1px solid rgba(240, 242, 247, 0.82);
                    border-radius: 27px;
                    background: rgba(255, 255, 255, 0.94);
                    box-shadow: 0 28px 55px rgba(42, 54, 77, 0.08);
                    transform: rotate(45deg) scaleY(0.56);
                }

                .fold-template-tile--left {
                    bottom: 120px;
                    left: -34px;
                }

                .fold-template-tile--left-mid {
                    bottom: 50px;
                    left: calc(25% - 77px);
                }

                .fold-template-tile--center {
                    bottom: -30px;
                    left: calc(50% - 77px);
                }

                .fold-template-tile--right-mid {
                    right: calc(25% - 77px);
                    bottom: 50px;
                }

                .fold-template-tile--right {
                    right: -34px;
                    bottom: 120px;
                }

                .fold-template-glyph {
                    position: relative;
                    display: block;
                    width: 74px;
                    height: 74px;
                    transform: rotate(-45deg) scaleY(1.7857);
                }

                .fold-template-glyph i {
                    position: absolute;
                    display: block;
                }

                .fold-template-glyph--orbit i {
                    width: 21px;
                    height: 12px;
                    border-radius: 999px;
                    background: var(--template-pink);
                }

                .fold-template-glyph--orbit i:nth-child(1) { top: 8px; left: 27px; }
                .fold-template-glyph--orbit i:nth-child(2) { top: 31px; right: 4px; transform: rotate(90deg); }
                .fold-template-glyph--orbit i:nth-child(3) { bottom: 8px; left: 27px; }
                .fold-template-glyph--orbit i:nth-child(4) { top: 31px; left: 4px; transform: rotate(90deg); }

                .fold-template-glyph--orbit::after {
                    position: absolute;
                    inset: 13px;
                    border: 4px solid #ffb4d6;
                    border-radius: 50%;
                    content: '';
                }

                .fold-template-glyph--bars i {
                    left: 8px;
                    width: 58px;
                    height: 12px;
                    border-radius: 3px;
                    background: var(--template-yellow);
                    transform: rotate(32deg);
                    box-shadow: 0 5px 0 #ffe172;
                }

                .fold-template-glyph--bars i:nth-child(1) { top: 13px; width: 42px; }
                .fold-template-glyph--bars i:nth-child(2) { top: 31px; left: 18px; width: 48px; }
                .fold-template-glyph--bars i:nth-child(3) { top: 49px; left: 7px; }

                .fold-template-glyph--path {
                    width: 72px;
                    height: 56px;
                    border-radius: 20px 20px 18px 18px;
                    background: var(--template-pink);
                    box-shadow: 0 12px 0 #ffc4de;
                }

                .fold-template-glyph--path i {
                    top: 16px;
                    left: 31px;
                    width: 16px;
                    height: 27px;
                    border: 5px solid #ffffff;
                    border-right: 0;
                    border-bottom-color: transparent;
                    border-radius: 8px 0 0 8px;
                    transform: rotate(9deg);
                }

                .fold-template-glyph--bow i {
                    top: 12px;
                    width: 42px;
                    height: 52px;
                    background: var(--template-blue);
                    clip-path: polygon(0 0, 100% 25%, 100% 75%, 0 100%);
                }

                .fold-template-glyph--bow i:first-child { left: 2px; }
                .fold-template-glyph--bow i:last-child { right: 2px; transform: scaleX(-1); }

                .fold-template-glyph--stack i {
                    left: 8px;
                    width: 58px;
                    height: 24px;
                    border-radius: 50%;
                    background: var(--template-yellow);
                }

                .fold-template-glyph--stack i:nth-child(1) { top: 7px; }
                .fold-template-glyph--stack i:nth-child(2) { top: 25px; }
                .fold-template-glyph--stack i:nth-child(3) { top: 43px; }

                @media (max-width: 820px) {
                    .fold-template-nav__links { display: none; }
                    .fold-template-brand { margin-right: auto; }
                    .fold-template-content { margin-top: 66px; }
                    .fold-template-title.f-heading { font-size: clamp(45px, 10vw, 62px); }
                    .fold-template-tile--left-mid { left: 13%; }
                    .fold-template-tile--right-mid { right: 13%; }
                }

                @media (max-width: 560px) {
                    .fold-template-shell { width: min(100% - 24px, 1120px); padding-top: 12px; }
                    .fold-template-nav { padding-left: 14px; }
                    .fold-template-locale { display: none; }
                    .fold-template-nav__cta.f-button { min-width: auto; }
                    .fold-template-content { margin-top: 58px; }
                    .fold-template-subtitle.f-text { max-width: 340px; }
                    .fold-template-tile--left-mid, .fold-template-tile--right-mid { display: none; }
                }
            `}</style>

            <View className="fold-template-shell">
                <View
                    as="nav"
                    className="fold-template-nav"
                    aria-label="Primary navigation">
                    <Text
                        as="a"
                        href="#"
                        className="fold-template-brand"
                        aria-label="Fold home">
                        <Logo
                            color="#09090b"
                            customSize={21}
                        />
                        <span>Fold</span>
                    </Text>

                    <View className="fold-template-nav__links">
                        {navigation.map((item) => (
                            <Text
                                key={item}
                                as="a"
                                href="#"
                                colorToken="text"
                                className="fold-template-nav__link">
                                {item}
                            </Text>
                        ))}
                    </View>

                    <View className="fold-template-nav__actions">
                        <Text
                            as="button"
                            className="fold-template-search"
                            aria-label="Search">
                            <IconLib
                                icon="search"
                                size="sm"
                            />
                        </Text>
                        <span
                            className="fold-template-locale"
                            aria-label="English language">
                            🇬🇧
                        </span>
                        <Button className="fold-template-nav__cta">Try Fold</Button>
                    </View>
                </View>

                <View
                    as="main"
                    className="fold-template-content">
                    <Heading className="fold-template-title">
                        Your future. Your
                        <br />
                        data. <span className="fold-template-highlight">Your AI.</span>
                    </Heading>
                    <Text className="fold-template-subtitle">
                        Take full control with a new data intelligence platform where you can manage all your data with
                        ease.
                    </Text>
                    <Button
                        variant="accent"
                        size="lg"
                        className="fold-template-primary"
                        suffix={
                            <IconLib
                                icon="arrow-right"
                                size="xs"
                            />
                        }>
                        Explore demo
                    </Button>
                </View>
            </View>

            <View
                className="fold-template-art"
                aria-hidden="true">
                <ProductTile
                    kind="orbit"
                    position="left"
                />
                <ProductTile
                    kind="bars"
                    position="left-mid"
                />
                <ProductTile
                    kind="path"
                    position="center"
                />
                <ProductTile
                    kind="bow"
                    position="right-mid"
                />
                <ProductTile
                    kind="stack"
                    position="right"
                />
            </View>
        </View>
    )
}

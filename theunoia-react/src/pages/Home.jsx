import { useEffect } from 'react';
import { runLegacy } from '../lib/runLegacy.js';
import { useRestoreDocument, useTitle } from '../lib/Legacy.jsx';
import Sheet from '../sections/home/Sheet.jsx';
import Hero from '../sections/home/Hero.jsx';
import ParticleStory from '../sections/home/ParticleStory.jsx';
import MeetTheunoia from '../sections/home/MeetTheunoia.jsx';
import AimVision from '../sections/home/AimVision.jsx';
import Luna from '../sections/home/Luna.jsx';
import Products from '../sections/home/Products.jsx';
import Inspirations from '../sections/home/Inspirations.jsx';
import Squad from '../sections/home/Squad.jsx';
import Independence from '../sections/home/Independence.jsx';
import DoodleStrip from '../sections/home/DoodleStrip.jsx';
import SiteFooter from '../sections/home/SiteFooter.jsx';
import homeCss from '../content/home/home.css?raw';
import sheetsJs from '../content/home/sheets.js?raw';
import navJs from '../content/nav.js?raw';
import meta from '../content/home/meta.json';

/**
 * The home page, top to bottom. The middle sections hang as paper folders (<Sheet>) that tilt as they rise.
 * homeCss holds the home-wide rules (phone polish, the folders, the hero headline tweaks); it comes last so it wins.
 */
export default function Home() {
  useTitle(meta.title);
  useRestoreDocument();
  // runs after every section is on the page: the hanging-folder motion and the menu button
  useEffect(() => runLegacy([sheetsJs, navJs], { name: 'home' }), []);
  return (
    <>
      <Hero />
      <ParticleStory />
      <Sheet id="tu" label="Meet THEUNOiA"><MeetTheunoia /></Sheet>
      <Sheet id="vmx" label="Aim & Vision"><AimVision /></Sheet>
      <Sheet id="luna" label="Luna"><Luna /></Sheet>
      <Sheet id="prod" label="Products"><Products /></Sheet>
      <Sheet id="insp" label="Inspirations"><Inspirations /></Sheet>
      <Sheet id="sq" label="The Squad"><Squad /></Sheet>
      <Sheet id="sd" label="Independence"><Independence /></Sheet>
      <DoodleStrip />
      <SiteFooter />
      <style data-block="home" dangerouslySetInnerHTML={{ __html: homeCss }} />
    </>
  );
}

import Hero from '../components/Hero';
import Objectives from '../components/Objectives';
import Team from '../components/Team';
import Gallery from '../components/Gallery';
import Donation from '../components/Donation';
import Newsfeed from '../components/Newsfeed';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Objectives />
      <Team />
      <Gallery />
      <Donation />
      <Newsfeed />
    </div>
  );
}

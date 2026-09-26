import { ResponsivePortrait } from '@/components/ResponsivePortrait'
import { profilePortrait } from '@/lib/siteConfig'
import styles from './about.module.css'

const chapters = [
  {
    marker: 'Before 2015',
    title: 'Curiosity beat the syllabus.',
    body: (
      <>
        <p>
          I was always passionate about computers and technology, but I started coding when I
          was 15. I had switched from a scientific, mostly theoretical high school to what in
          Italy is called a technical high school, where I learned the basics of programming
          and computer science.
        </p>
        <p>
          I was never a good student. School bored me and I never liked studying, but I was
          always curious and loved learning new things, especially when they involved computers
          or music. I played in several bands well before my tech career began. Music did not pay
          the bills, so here I am, working in tech.
        </p>
        <blockquote>
          <p>
            Most of my professors told me I would never work in tech because I was not good
            enough. I kept learning on my own anyway.
          </p>
        </blockquote>
        <p>
          Many people in my life were not happy with that choice either. They wanted me to go to
          university, get a degree, and find a “real job” instead of “playing with computers.”
          I wanted to work and learn by doing. I also tried to venture into esports, but that did
          not go as expected either.
        </p>
      </>
    ),
  },
  {
    marker: '2015',
    title: 'Production code before a driving licence.',
    body: (
      <>
        <p>
          I started my professional journey in 2015 as a web developer, writing production-grade
          PHP before I had my driving licence.
        </p>
        <p>
          As an employee, I started as a full-stack developer at a small company building
          embedded software in C and internal tools in C#. Then I joined a promising local
          startup, still as a full-stack developer, but back to PHP with a Laravel flavour.
        </p>
        <p>
          The only other developer, who was also my mentor, left after just a few weeks. I found
          myself as the only technical person in the building. Fun.
        </p>
        <aside className={styles.marginNote}>
          I never really had a mentor. I had to figure things out by myself and do the genuine
          “fake it till you make it” thing.
        </aside>
      </>
    ),
  },
  {
    marker: 'Milan → 2018',
    title: 'Software engineering, then the dark side.',
    body: (
      <>
        <p>
          After high school I moved to Milan, switched languages to specialise in Java, and built
          my back end as a Software Engineer. I climbed the ladder, worked on large-scale products
          serving more than eight million users at the time. It serves more than ten million
          today. Eventually, I became a Senior Software Engineer.
        </p>
        <p>
          Since I am fundamentally lazy, I learned to love automation. I started with Bash scripts
          and moved into DevOps tools and practices.
        </p>
        <blockquote className={styles.dialogue}>
          <p>“Do you know Kubernetes?”</p>
          <p>“Yes, of course.”</p>
          <strong>I was lying.</strong>
          <span>It was 2018. In Italy, very few people knew what it was.</span>
        </blockquote>
        <p>
          I joined the dark side of DevOps and Site Reliability Engineering, bringing the best of
          my software engineering background with me. I led DevOps initiatives, improved DORA
          metrics. We measured before changing anything. I also helped multiple teams move from
          zero to GitOps.
        </p>
      </>
    ),
  },
  {
    marker: '2021',
    title: 'No ladder? Build another one.',
    body: (
      <>
        <p>
          Eventually I hit a ceiling, both at the company where I worked and in the Italian IT
          market. Italy did not have a clear Individual Contributor ladder. In most companies,
          you either became a manager or stayed at Senior. That was 2021. Things may have changed,
          and I hope they have; I still have family and friends working in tech there.
        </p>
        <p>
          So I became a freelance professional and something of a digital nomad. I wanted to scale
          my impact on the industry and help more people and companies achieve their goals.
        </p>
        <p>
          I took on far more clients than I could handle. That meant endless weeks, nights, and
          weekends spent grinding. Yes, I made more money than ever before. Honestly, more than
          I have since. It was a ridiculous amount of money every month.
        </p>
        <p>
          I coached and mentored people on DevOps principles and practices and, in hindsight, on
          Platform Engineering before it was cool, Kubernetes included. I helped companies with
          infrastructure, developer experience, CI/CD, DevSecOps, and the processes around them.
        </p>
        <p>
          I also learned more front end, especially React. I always despised JavaScript, but
          TypeScript made me like it a little more. It is still not my thing, but I can live with
          it. Node.js is more fun than I expected; I will give you that. This joined Python and Go
          in my main toolbox, with a pinch of C, C++, and C# from the past. PHP? Gone. I do not
          want to touch it anymore. Sorry.
        </p>
      </>
    ),
  },
  {
    marker: '2023',
    title: 'Cofounder, CTO, and a hard lesson.',
    body: (
      <>
        <p>
          After working across Europe as a digital nomad, I joined KubeLab in 2023 as a late
          cofounder and CTO. I guided its pivot from a bootstrapped consultancy to a product
          company.
        </p>
        <p>
          It was a hell of a year. I enjoyed building a new company culture, revolutionising its
          services, taking a product from zero to one end to end, and caring for my team until the
          very end. I even gave up my severance so theirs could be paid. It was only fair. Big tech
          can definitely do better when laying people off for no reason.
        </p>
        <aside className={`${styles.marginNote} ${styles.warningNote}`}>
          Note to self: equal ownership, or you are not a cofounder.
        </aside>
        <p>
          Like many startups, we could not find product-market fit and had to step back. Failure
          became the greatest teacher.
        </p>
      </>
    ),
  },
  {
    marker: '2024 → 2026',
    title: 'Community, customers, and cautious optimism.',
    body: (
      <>
        <p>
          I kept advocating for cloud native technologies. I started contributing to Kubernetes
          upstream in 2024 and, as of 2026, I am still going. I have also been a CNCF Ambassador
          since 2024, with a term set to run at least through 2028.
        </p>
        <p>
          I strongly believe in the power of Platform Engineering. I co-authored the CNPA exam
          with many smart people from the community, and I look forward to having a further impact
          on the tech industry through my work.
        </p>
        <p>
          After a short chapter at a Y Combinator W22 startup, where I joined as employee number
          15 and became the effective Head of DevRel and Marketing. I was also the only DevRel,
          to be fair. Then I joined GitHub as a Solutions Engineer.
        </p>
        <p>
          Pre-sales is not really my thing, but I enjoy talking with customers and diving into the
          nitty-gritty of complex, foundational products such as GitHub Actions.
        </p>
        <p>
          I used to be an AI sceptic. Now I am a very cautious optimist, working on several hobby
          projects I had zero time for before AI. I am also still leading a band in Berlin,
          despite living somewhat close to Amsterdam and travelling fairly often to Italy and the
          United States.
        </p>
      </>
    ),
  },
]

export default function About() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 id="about-title">A note from our CEO.</h1>
            <p className={styles.lede}>
              The title is part of the product joke. The story is not. Curiosity, stubbornness,
              bad decisions, good decisions, and a few failures brought me here.
            </p>
            <a className={styles.jumpLink} href="#the-note">
              Read the note
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <figure className={styles.portrait}>
            <ResponsivePortrait
              alt={profilePortrait.alt}
              className={styles.portraitImage}
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1080px) 42vw, 460px"
              priority
            />
            <figcaption>
              <span>Matteo Bianchi</span>
              Speaking at KCD Denmark
            </figcaption>
          </figure>
        </div>
      </section>

      <article id="the-note" className={styles.letter} aria-label="A note from Matteo Bianchi">
        <div className={styles.letterHeader}>
          <div>
            <h2>I learned by doing. Then I kept going.</h2>
            <p>
              This is not a polished founder myth. It is the longer, messier version: the boring
              school days, the lie that led to Kubernetes, the startup that did not find its
              market, and the communities and people who made the work worth doing.
            </p>
          </div>
        </div>

        <div className={styles.chapters}>
          {chapters.map((chapter) => (
            <section key={chapter.marker} className={styles.chapter} aria-labelledby={`chapter-${chapter.marker.replace(/\W+/g, '-').toLowerCase()}`}>
              <div className={styles.chapterMarker} aria-hidden="true">
                <span>{chapter.marker}</span>
              </div>
              <div className={styles.chapterBody}>
                <p className={styles.chapterKicker}>{chapter.marker}</p>
                <h2 id={`chapter-${chapter.marker.replace(/\W+/g, '-').toLowerCase()}`}>
                  {chapter.title}
                </h2>
                {chapter.body}
              </div>
            </section>
          ))}
        </div>

        <div className={styles.signoff}>
          <p>What will I do in 2027 and beyond? Who knows.</p>
          <strong>To be continued…</strong>
          <div aria-label="Signed by Matteo Bianchi">
            <span>Matteo</span>
            <p>Matteo Bianchi</p>
          </div>
        </div>
      </article>
    </div>
  )
}

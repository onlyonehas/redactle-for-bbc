import type { Article } from '../utils/gameLogic';

export const ARTICLES: Article[] = [
    {
        id: '1',
        headline: "James Webb Space Telescope captures stunning new detailed images of Ring Nebula",
        category: "Science",
        date: "2023-08-21",
        avgGuesses: 45,
        content: [
            "The James Webb Space Telescope (JWST) has captured incredible new details of the Ring Nebula, revealing the intricate structure of the final stages of a dying star's life.",
            "The Ring Nebula, also known as Messier 57, is located about 2,600 light-years away from Earth in the constellation Lyra and has been a popular target for astronomers for years.",
            "These new images from the James Webb telescope show the nebula's donut-like structure of glowing gas in unprecedented resolution, capturing details that were previously invisible to other telescopes.",
            "Dr. Mike Barlow, a professor at University College London and co-leader of the JWST Ring Nebula Project, said: 'The James Webb Space Telescope has provided us with an extraordinary view of the Ring Nebula that we have never seen before.'",
            "The images reveal the complexity of the expanding shell of gas expelled by the central star as it evolves into a white dwarf.",
            "Scientists hope that studying these images will help them understand the life cycles of stars and the formation of planetary nebulae.",
            "The telescope's infrared capabilities allow it to peer through the cosmic dust and see the delicate interaction of light and matter in the nebula."
        ]
    },
    {
        id: '2',
        headline: "Man walks on moon: Neil Armstrong makes history",
        category: "History",
        date: "1969-07-21",
        content: [
            "American astronaut Neil Armstrong has become the first human being to walk on the surface of the Moon.",
            "At 02:56 GMT, Armstrong stepped off the lunar module Eagle and onto the dusty surface of the Sea of Tranquility, declaring: 'That's one small step for man, one giant leap for mankind.'",
            "He was joined minutes later by his colleague Edwin 'Buzz' Aldrin, while Michael Collins circled the Moon in the command module Columbia.",
            "The historic event was watched on television by an estimated 600 million people around the world.",
            "The astronauts planted a US flag and collected soil and rock samples during their two and a half hour moonwalk.",
            "This achievement fulfills the goal set by President John F. Kennedy in 1961 to land a man on the Moon and return him safely to Earth before the end of the decade."
        ]
    },
    {
        id: '3',
        headline: "Leicester City win Premier League title in football fairytale",
        category: "Sport",
        date: "2016-05-02",
        content: [
            "Leicester City have completed one of the most remarkable stories in the history of football by winning the Premier League title.",
            "The Foxes, who started the season as 5,000-1 outsiders to win the trophy, were confirmed as champions after Tottenham Hotspur failed to beat Chelsea.",
            "Managed by Claudio Ranieri, the team has lost just three league games all season, a stark contrast to their fight against relegation under Nigel Pearson a year ago.",
            "Striker Jamie Vardy, who was playing non-league football just a few years ago, and winger Riyad Mahrez have been instrumental in the club's success.",
            "Thousands of fans gathered at the King Power Stadium to celebrate the historic victory, which has been described as the greatest sporting shock of all time.",
            "Captain Wes Morgan will lift the trophy after Saturday's final home game of the season against Everton."
        ]
    },
    {
        id: '4',
        headline: "Berlin Wall falls as borders open between East and West",
        category: "World",
        date: "1989-11-09",
        content: [
            "The Berlin Wall, the most potent symbol of the Cold War division between East and West, has been breached after 28 years.",
            "Thousands of East Germans surged through the border crossing points after the government unexpectedly announced that citizens could visit West Germany and West Berlin.",
            "Joyous scenes erupted at the Brandenburg Gate as people from both sides of the divided city climbed onto the wall, dancing and hugging in celebration.",
            "West Berliners greeted their eastern neighbors with champagne and flowers in an emotional reunion that many thought they would never see.",
            "The East German government's spokesman, Günter Schabowski, had earlier announced the lifting of travel restrictions, seemingly by mistake, effective 'immediately'.",
            "World leaders have welcomed the news, with many expressing hope that this marks the beginning of a new era of freedom and unity in Europe."
        ]
    },
    {
        id: '5',
        headline: "Apple unveils iPhone and reinvents the mobile phone",
        category: "Technology",
        date: "2007-01-09",
        content: [
            "Apple boss Steve Jobs has unveiled the long-awaited iPhone, a device he claims will 'reinvent the phone'.",
            "Combining an iPod, a mobile phone, and an internet communicator, the device features a revolutionary multi-touch interface.",
            "Speaking at the Macworld Expo in San Francisco, Jobs demonstrated how users can control the device with their fingers, removing the need for a stylus or physical keyboard.",
            "The iPhone features a 3.5-inch screen, a 2-megapixel camera, and runs on a version of Apple's OS X operating system.",
            "Tech analysts have reacted with excitement, predicting that the device could transform the mobile industry in the same way the iPod changed the music industry.",
            "The device is set to go on sale in the US in June, with a European launch expected later in the year."
        ]
    },
    {
        id: '6',
        headline: "London 2012: Team GB hits gold rush on Super Saturday",
        category: "Sport",
        date: "2012-08-04",
        content: [
            "It was the greatest night in British athletics history as Team GB won three gold medals in the space of an hour at the Olympic Stadium.",
            "Jessica Ennis-Hill started the gold rush by completing a dominant victory in the heptathlon, collapsing in tears of joy as she crossed the finish line.",
            "Long jumper Greg Rutherford then shocked the world to take gold, before Mo Farah capped off the evening with a stunning victory in the 10,000m.",
            "The roar from the 80,000-strong crowd was deafening as Farah kicked down the home straight to claim Britain's third gold of the night on the track.",
            "Earlier in the day, the rowing team added two more golds at Eton Dorney, making this Britain's most successful day at an Olympics in 104 years.",
            "Prime Minister David Cameron described the day's events as 'an awe-inspiring display of British athletic prowess'."
        ]
    },
    {
        id: '7',
        headline: "Coronation of King Charles III takes place at Westminster Abbey",
        category: "UK",
        date: "2023-05-06",
        content: [
            "King Charles III has been crowned at Westminster Abbey in a ceremony built on ancient traditions but modified for the modern age.",
            "He became the 40th reigning monarch to be crowned there since 1066. The Archbishop of Canterbury placed the St Edward's Crown on his head.",
            "Queen Camilla was also crowned during the service, which was watched by millions of people across the globe.",
            "Thousands of people lined the streets of London despite the rain to catch a glimpse of the King and Queen in the Gold State Coach processing back to Buckingham Palace.",
            "The ceremony was attended by world leaders, foreign royals, and community volunteers, reflecting the King's desire for a slimmed-down but inclusive event.",
            "Crowds cheered as the newly crowned King and Queen appeared on the palace balcony to watch a flypast by the Red Arrows."
        ]
    }
];

export function getDailyArticle(): Article {
    // Calculate days since epoch to get a consistent daily index
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const index = daysSinceEpoch % ARTICLES.length;
    return ARTICLES[index];
}

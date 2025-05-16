export function addSampleData() {
    // Sample movies data
    const sampleMovies = [
        { title: 'Inception', releaseDate: new Date('2010-07-16'), voteAverage: 8.8, genres: ['Action', 'Sci-Fi'], overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.' },
        { title: 'The Dark Knight', releaseDate: new Date('2008-07-18'), voteAverage: 9.0, genres: ['Action', 'Crime', 'Drama'], overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.' }
    ];

    // Sample series data
    const sampleSeries = [
        { name: 'Breaking Bad', firstAirDate: new Date('2008-01-20'), voteAverage: 9.5, overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.' },
        { name: 'Stranger Things', firstAirDate: new Date('2016-07-15'), voteAverage: 8.7, overview: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.' }
    ];

    console.log('Sample movies and series data added');
    // TODO: Save sample data to database
}

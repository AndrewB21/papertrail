export class Anime {
    public attributes: {
     ageRating: string;
     ageRatingGuide: string;
     averageRating: number;
     slug: string;
     coverImage: {
        tiny: string;
        small: string;
        large: string;
        original: string;
        meta: {
            dimsensions: {
                tiny: {
                    width: number;
                    height: number;
                },
                small: {
                    width: number;
                    height: number;
                },
                large: {
                        width: number;
                        height: number;
                },
            }
        }
    };
     description: string;
     episodeCount: number;
     episodeLength: number;
     nsfw: boolean;
     popularityRank: number;
     posterImage: {
        tiny: string;
        small: string;
        medium: string;
        large: string;
        original: string;
        meta: {
            dimsensions: {
                tiny: {
                    width: number;
                    height: number;
                },
                small: {
                width: number;
                height: number;
                },
                medium: {
                    width: number;
                    height: number;
                },
                large: {
                    width: number;
                    height: number;
                },
            }
        }
    };
     ratingRank: number;
     showType: string;
     status: string;
     synopsis: string;
     titles: {
        en: string;
        en_jp: string;
        en_us: string;
        ja_jp: string;
    };
     totalLength: number;
     youtubeVideoId: string;
    };
    public id: string;
    public relationships: {};
    public type: string;
}

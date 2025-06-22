type actionType = 'addLike' | 'removeLike' | 'addDislike' | 'removeDislike' | 'toggleLike' | "toggleDislike"

export const recountLikesHelper = (likesInf: { likesCount: number, dislikesCount: number }, action: actionType) => {

    switch (action) {
        case 'addLike':
            return {
                likesCount: likesInf.likesCount + 1,
                dislikesCount: likesInf.dislikesCount
            }
        case 'removeLike':
            return {
                likesCount: likesInf.likesCount - 1,
                dislikesCount: likesInf.dislikesCount
            }
        case 'addDislike':
            return {
                likesCount: likesInf.likesCount,
                dislikesCount: likesInf.dislikesCount + 1
            }
        case 'removeDislike':
            return {
                likesCount: likesInf.likesCount,
                dislikesCount: likesInf.dislikesCount - 1
            }
        case 'toggleLike':
            return {
                likesCount: likesInf.likesCount + 1,
                dislikesCount: likesInf.dislikesCount - 1
            }
        case 'toggleDislike':
            return {
                likesCount: likesInf.likesCount - 1,
                dislikesCount: likesInf.dislikesCount + 1
            }

        default:
            return likesInf

    }
}
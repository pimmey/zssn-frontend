import { Gender } from '~/data/__generated__'

type UserEmojiProps = {
  gender: Gender
  isInfected: boolean
}
export default function UserEmoji({
  gender,
  isInfected
}: UserEmojiProps) {
  if (isInfected) {
    if (gender === 'male') {
      return '🧟‍♂️'
    } else if (gender === 'female') {
      return '🧟‍♀️'
    } else {
      return '💀'
    }
  }

  if (gender === 'male') {
    return '👨'
  } else if (gender === 'female') {
    return '👩'
  } else {
    return '🙂'
  }
}

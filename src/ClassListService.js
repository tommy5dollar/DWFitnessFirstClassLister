export const baseUrl = `https://www.dwfitnessfirst.com/`

const classUrl = `${baseUrl}umbraco/surface/classessurface/getbookingclassesbydate/`

const corsWrap = url => `https://cors-anywhere.herokuapp.com/${url}`

const randomHmm = `1527021511`

const getAllClassesByGym = async (gymName, memberId) => fetch(corsWrap(classUrl), {
  method: `POST`,
  headers: {
    [`Content-Type`]: `application/x-www-form-urlencoded`
  },
  body: `Club=${gymName}&Member=${memberId}&Random=${randomHmm}&Class=-1`
})

export const getAllClasses = async (clubs, memberId) => {
  const allGymResponses = await Promise.all(clubs.map(async club => (await getAllClassesByGym(club, memberId)).json()))

  return allGymResponses.reduce((agg, gymData) => gymData.ClassDates.reduce((innerAgg, classDate) => [...innerAgg, ...classDate.Classes], agg), [])
}
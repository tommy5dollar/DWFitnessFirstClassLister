export const baseUrl = `https://www.dwfitnessfirst.com/`

const classUrl = `${baseUrl}umbraco/surface/classessurface/getbookingclassesbydate/`

const corsWrap = url => `https://cors-anywhere.herokuapp.com/${url}`

const getAllClassesByGym = async gymName => fetch(corsWrap(classUrl), {
  method: `POST`,
  headers: {
    [`Content-Type`]: `application/x-www-form-urlencoded`
  },
  body: `Club=${gymName}`
})

export const getAllClasses = async clubs => {
  const allGymResponses = await Promise.all(clubs.map(async club => (await getAllClassesByGym(club)).json()))

  return allGymResponses.reduce((agg, gymData) => gymData.ClassDates.reduce((innerAgg, classDate) => [...innerAgg, ...classDate.Classes], agg), [])
}
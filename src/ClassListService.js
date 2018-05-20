export const baseUrl = `https://www.dwfitnessfirst.com/`

const classUrl = `${baseUrl}umbraco/surface/classessurface/getbookingclassesbydate/`

const gyms = [
  `FENCH`,
  `THOM`,
  `SPIT`,
  `DEVON`
]

const corsWrap = url => `http://cors-anywhere.herokuapp.com/${url}`

const getAllClassesByGym = async gymName => fetch(corsWrap(classUrl), {
  method: `POST`,
  headers: {
    [`Content-Type`]: `application/x-www-form-urlencoded`
  },
  body: `Club=${gymName}`
})

export const getAllClasses = async () => {
  const allGymResponses = await Promise.all(gyms.map(async gym => (await getAllClassesByGym(gym)).json()))

  return allGymResponses.reduce((agg, gymData) => gymData.ClassDates.reduce((innerAgg, classDate) => [...innerAgg, ...classDate.Classes], agg), [])
}
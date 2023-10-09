import moment from 'moment'
export const dateFormate = (date = null) => {
  if (!date) return "-"
  return moment(date).format("DD-MM-YYYY & hh:mm A")

}
export const dateOnly = (date = null) => {
  if (!date) return "-"
  return moment(date).format("YYYY-DD-MM")

}
export const dateForm = (date = null) => {
  return moment(date ?? new Date()).format("DD-MM-YYYY")

}

export const dateOnlyRev = (date = null) => {
  if (!date) return "-"
  return moment(date).format("YYYY-MM-DD")

}


export const dataSort = (list, field) => {
  list.sort(function (a, b) {
    var nameA = a[field];
    var nameB = b[field];
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  });
  return list;

}
export const capitalLatter = (string) => {
  if (string) {
    if (string.length < 4) {
      return string;
    } else {
      return string.replace(/[A-Z][a-z]*/g, str => ' ' + str)
    }

  } else {
    return string;
  }
}
export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const parseData = (data = null) => {
  if (data) {
    try {
      return JSON.parse(data)
    }
    catch (err) {
      return null;
    }
  }
  return null;

}

export let state = [ "Andhra Pradesh",
"Arunachal Pradesh",
"Assam",
"Bihar",
"Chhattisgarh",
"Goa",
"Gujarat",
"Haryana",
"Himachal Pradesh",
"Jammu and Kashmir",
"Jharkhand",
"Karnataka",
"Kerala",
"Madhya Pradesh",
"Maharashtra",
"Manipur",
"Meghalaya",
"Mizoram",
"Nagaland",
"Odisha",
"Punjab",
"Rajasthan",
"Sikkim",
"Tamil Nadu",
"Telangana",
"Tripura",
"Uttarakhand",
"Uttar Pradesh",
"West Bengal",
"Andaman and Nicobar Islands",
"Chandigarh",
"Dadra and Nagar Haveli",
"Daman and Diu",
"Delhi",
"Lakshadweep",
"Puducherry"]

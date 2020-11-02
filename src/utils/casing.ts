function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
}

function formatCamelCase(str: string): string {
  return capitalize(str.replace(/([a-z])([A-Z])/g, '$1 $2'))
}

export { capitalize, formatCamelCase }

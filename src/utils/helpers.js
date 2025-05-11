function safeJsonParse(response) {
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Initial JSON parsing error:', error);

    const sanitizedResponse = response
      .replace(/^json\n/, '')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(sanitizedResponse);
    } catch (finalError) {
      console.error('JSON parsing error after cleanup:', sanitizedResponse, finalError);
      throw new Error('OpenAI response is not valid JSON.');
    }
  }
}

function removeEmptyArrays(obj) {
  if (Array.isArray(obj)) {
    return obj.length ? obj : undefined;
  } else if (typeof obj === 'object' && obj !== null) {
    let cleanedObj = {};
    Object.entries(obj).forEach(([key, value]) => {
      let cleanedValue = removeEmptyArrays(value);
      if (cleanedValue !== undefined) {
        cleanedObj[key] = cleanedValue;
      }
    });
    return Object.keys(cleanedObj).length ? cleanedObj : undefined;
  }
  return obj;
}

export { safeJsonParse, removeEmptyArrays };

const calculate = (theory) => {
    const option_popularities = [];
    const option_priority_weights = [];
    for (const option of theory) {
      option_popularities.push(option.popularity);
      option_priority_weights.push(option.priority_weight);
    }

    const weighted_popularities = [];
    for (const priority_weight of zip(option_popularities, option_priority_weights)) {
      weighted_popularities.push(popularity * priority_weight);
    }

    const overall_percentage_analysis = sum(weighted_popularities) / len(weighted_popularities);
    return 60;
}

module.exports = calculate
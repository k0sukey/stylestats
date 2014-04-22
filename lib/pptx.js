var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var color = require('color');
var officegen = require('officegen-2');

var aliases = require('../assets/aliases.json');

function Factory(data, output) {
    data = data || {};
    output = output || './';

    var i;

    var pptx = officegen('pptx');
    pptx.setDocTitle('t32k/stylestats');
    var slide;

    // title
    slide = pptx.makeNewSlide();
    slide.back = 'ffffff';
    slide.color = '878787';
    slide.addImage(__dirname + '/../assets/stylestats.png', {
            y: 'c',
            x: 'c'
        });
    if (_.has(data, 'published')) {
        slide.addText(data.published.toString(), {
            x: 'c',
            y: 500,
            cx: '100%',
            cy: 48,
            font_size: 24,
            align: 'center'
        });
    }

    // paths
    if (_.has(data, 'paths')) {
        slide = pptx.makeNewSlide();
        slide.back = 'f8f8f8';
        slide.color = '878787';
        slide.addText(aliases.paths, {
            x: 75,
            y: 35,
            cx: 760,
            cy: 72,
            font_size: 36
        });
        slide.addText(data.paths.join('\n'), {
            x: 75,
            y: 107,
            cx: 760,
            cy: 500,
            font_size: 24
        });
    }

    // metrics
    var metrics = _.pick(data, [
        'stylesheets',
        'styleElements',
        'size',
        'dataUriSize',
        'ratioOfDataUriSize',
        'gzippedSize',
        'simplicity',
        'rules',
        'selectors',
        'idSelectors',
        'universalSelectors',
        'unqualifiedAttributeSelectors',
        'javascriptSpecificSelectors',
        'importantKeywords',
        'floatProperties',
        'mediaQueries',
        'requestOptions']);
    var indexes = [];
    var elements = [];
    var iterator = 0;
    if (Object.keys(metrics).length > 0) {
        _.each(metrics, function(element, index){
            if (iterator > 12) {
                slide = pptx.makeNewSlide();
                slide.back = 'f8f8f8';
                slide.color = '878787';
                slide.addText('Metrics', {
                    x: 75,
                    y: 35,
                    cx: 760,
                    cy: 72,
                    font_size: 36
                });
                slide.addText(indexes.join('\n'), {
                    x: 75,
                    y: 107,
                    cx: 440,
                    cy: 500,
                    font_size: 24
                });
                slide.addText(elements.join('\n'), {
                    x: 515,
                    y: 107,
                    cx: 320,
                    cy: 500,
                    font_size: 24
                });
                indexes = [];
                elements = [];
                iterator = 0;
            }
            indexes.push(aliases[index]);
            if (index === 'lowestCohesionSelector' || index === 'uniqueFontSize') {
                elements.push(element.join(' '));
            } else {
                elements.push(element);
            }
            iterator += 1;
        });
        if (indexes.length > 0) {
            slide = pptx.makeNewSlide();
            slide.back = 'f8f8f8';
            slide.color = '878787';
            slide.addText('Metrics', {
                x: 75,
                y: 35,
                cx: 760,
                cy: 72,
                font_size: 36
            });
            slide.addText(indexes.join('\n'), {
                x: 75,
                y: 107,
                cx: 440,
                cy: 500,
                font_size: 24
            });
            slide.addText(elements.join('\n'), {
                x: 515,
                y: 107,
                cx: 320,
                cy: 500,
                font_size: 24
            });
        }
    }

    // mostIdentifierSelector
    var selector = [];
    var mostIdentifierSelector = [];
    iterator = 0;
    if (_.has(data, 'mostIdentifierSelector')) {
        selector[0] = [];
        selector[1] = [];
        selector[2] = [];
        mostIdentifierSelector = data.mostIdentifierSelector.split(' ');
        for (i = 0; i < mostIdentifierSelector.length; i += 3) {
            if (iterator > 15) {
                slide = pptx.makeNewSlide();
                slide.back = 'f8f8f8';
                slide.color = '878787';
                slide.addText(aliases.mostIdentifierSelector, {
                    x: 75,
                    y: 35,
                    cx: 760,
                    cy: 72,
                    font_size: 36
                });
                if (_.has(data, 'mostIdentifier')) {
                    slide.addText(aliases.mostIdentifier + ': ' + data.mostIdentifier, {
                        x: 75,
                        y: 107,
                        cx: 760,
                        cy: 48,
                        font_size: 24
                    });
                }
                slide.addText(selector[0].join('\n'), {
                    x: 75,
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                slide.addText(selector[1].join('\n'), {
                    x: 'c',
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                slide.addText(selector[2].join('\n'), {
                    x: 585,
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                selector[0] = [];
                selector[1] = [];
                selector[2] = [];
                iterator = 0;
            }
            selector[0].push(mostIdentifierSelector[i]);
            selector[1].push(mostIdentifierSelector[i + 1]);
            selector[2].push(mostIdentifierSelector[i + 2]);
            iterator += 1;
        }
        if (selector[0].length > 0) {
            slide = pptx.makeNewSlide();
            slide.back = 'f8f8f8';
            slide.color = '878787';
            slide.addText(aliases.mostIdentifierSelector, {
                x: 75,
                y: 35,
                cx: 760,
                cy: 72,
                font_size: 36
            });
            if (_.has(data, 'mostIdentifier')) {
                slide.addText(aliases.mostIdentifier + ': ' + data.mostIdentifier, {
                    x: 75,
                    y: 107,
                    cx: 760,
                    cy: 48,
                    font_size: 24
                });
            }
            slide.addText(selector[0].join('\n'), {
                x: 75,
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
            slide.addText(selector[1].join('\n'), {
                x: 'c',
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
            slide.addText(selector[2].join('\n'), {
                x: 585,
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
        }
    }

    // lowestCohesionSelector
    selector = [];
    iterator = 0;
    if (_.has(data, 'lowestCohesionSelector')) {
        selector[0] = [];
        selector[1] = [];
        selector[2] = [];
        for (i = 0; i < data.lowestCohesionSelector.length; i += 3) {
            if (iterator > 15) {
                slide = pptx.makeNewSlide();
                slide.back = 'f8f8f8';
                slide.color = '878787';
                slide.addText(aliases.lowestCohesionSelector, {
                    x: 75,
                    y: 35,
                    cx: 760,
                    cy: 72,
                    font_size: 36
                });
                if (_.has(data, 'lowestCohesion')) {
                    slide.addText(aliases.lowestCohesion + ': ' + data.lowestCohesion, {
                        x: 75,
                        y: 107,
                        cx: 760,
                        cy: 48,
                        font_size: 24
                    });
                }
                slide.addText(selector[0].join('\n'), {
                    x: 75,
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                slide.addText(selector[1].join('\n'), {
                    x: 'c',
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                slide.addText(selector[2].join('\n'), {
                    x: 585,
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                selector[0] = [];
                selector[1] = [];
                selector[2] = [];
                iterator = 0;
            }
            selector[0].push(data.lowestCohesionSelector[i]);
            selector[1].push(data.lowestCohesionSelector[i + 1]);
            selector[2].push(data.lowestCohesionSelector[i + 2]);
            iterator += 1;
        }
        if (selector[0].length > 0) {
            slide = pptx.makeNewSlide();
            slide.back = 'f8f8f8';
            slide.color = '878787';
            slide.addText(aliases.lowestCohesionSelector, {
                x: 75,
                y: 35,
                cx: 760,
                cy: 72,
                font_size: 36
            });
            if (_.has(data, 'lowestCohesion')) {
                slide.addText(aliases.lowestCohesion + ': ' + data.lowestCohesion, {
                    x: 75,
                    y: 107,
                    cx: 760,
                    cy: 48,
                    font_size: 24
                });
            }
            slide.addText(selector[0].join('\n'), {
                x: 75,
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
            slide.addText(selector[1].join('\n'), {
                x: 'c',
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
            slide.addText(selector[2].join('\n'), {
                x: 585,
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
        }
    }

    // uniqueFontSize
    var fonts = [];
    iterator = 0;
    if (_.has(data, 'uniqueFontSize')) {
        fonts[0] = [];
        fonts[1] = [];
        fonts[2] = [];
        for (i = 0; i < data.uniqueFontSize.length; i += 3) {
            if (iterator > 15) {
                slide = pptx.makeNewSlide();
                slide.back = 'f8f8f8';
                slide.color = '878787';
                slide.addText(aliases.uniqueFontSize, {
                    x: 75,
                    y: 35,
                    cx: 760,
                    cy: 72,
                    font_size: 36
                });
                if (_.has(data, 'totalUniqueFontSizes')) {
                    slide.addText(aliases.totalUniqueFontSizes + ': ' + data.totalUniqueFontSizes, {
                        x: 75,
                        y: 107,
                        cx: 760,
                        cy: 48,
                        font_size: 24
                    });
                }
                slide.addText(fonts[0].join('\n'), {
                    x: 75,
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                slide.addText(fonts[1].join('\n'), {
                    x: 'c',
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                slide.addText(fonts[2].join('\n'), {
                    x: 585,
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                fonts[0] = [];
                fonts[1] = [];
                fonts[2] = [];
                iterator = 0;
            }
            fonts[0].push(data.uniqueFontSize[i]);
            fonts[1].push(data.uniqueFontSize[i + 1]);
            fonts[2].push(data.uniqueFontSize[i + 2]);
            iterator += 1;
        }
        if (fonts[0].length > 0) {
            slide = pptx.makeNewSlide();
            slide.back = 'f8f8f8';
            slide.color = '878787';
            slide.addText(aliases.uniqueFontSize, {
                x: 75,
                y: 35,
                cx: 760,
                cy: 72,
                font_size: 36
            });
            if (_.has(data, 'totalUniqueFontSizes')) {
                slide.addText(aliases.totalUniqueFontSizes + ': ' + data.totalUniqueFontSizes, {
                    x: 75,
                    y: 107,
                    cx: 760,
                    cy: 48,
                    font_size: 24
                });
            }
            slide.addText(fonts[0].join('\n'), {
                x: 75,
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
            slide.addText(fonts[1].join('\n'), {
                x: 'c',
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
            slide.addText(fonts[2].join('\n'), {
                x: 585,
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
        }
    }

    // uniqueColor
    var labels = [];
    var values = [];
    var colors = [];
    iterator = 0;
    if (_.has(data, 'uniqueColor')) {
        colors[0] = [];
        colors[1] = [];
        colors[2] = [];
        for (i = 0; i < data.uniqueColor.length; i += 3) {
            if (iterator > 15) {
                slide = pptx.makeNewSlide();
                slide.back = 'f8f8f8';
                slide.color = '878787';
                slide.addText(aliases.uniqueColor, {
                    x: 75,
                    y: 35,
                    cx: 760,
                    cy: 72,
                    font_size: 36
                });
                if (_.has(data, 'totalUniqueColors')) {
                    slide.addText(aliases.totalUniqueColors + ': ' + data.totalUniqueColors, {
                        x: 75,
                        y: 107,
                        cx: 760,
                        cy: 48,
                        font_size: 24
                    });
                }
                slide.addText(colors[0].join('\n'), {
                    x: 75,
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                slide.addText(colors[1].join('\n'), {
                    x: 'c',
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                slide.addText(colors[2].join('\n'), {
                    x: 585,
                    y: 155,
                    cx: 250,
                    cy: 452,
                    font_size: 18
                });
                colors[0] = [];
                colors[1] = [];
                colors[2] = [];
                iterator = 0;
            }
            colors[0].push(data.uniqueColor[i]);
            colors[1].push(data.uniqueColor[i + 1]);
            colors[2].push(data.uniqueColor[i + 2]);
            iterator += 1;
        }
        if (colors[0].length > 0) {
            slide = pptx.makeNewSlide();
            slide.back = 'f8f8f8';
            slide.color = '878787';
            slide.addText(aliases.uniqueColor, {
                x: 75,
                y: 35,
                cx: 760,
                cy: 72,
                font_size: 36
            });
            if (_.has(data, 'totalUniqueColors')) {
                slide.addText(aliases.totalUniqueColors + ': ' + data.totalUniqueColors, {
                    x: 75,
                    y: 107,
                    cx: 760,
                    cy: 48,
                    font_size: 24
                });
            }
            slide.addText(colors[0].join('\n'), {
                x: 75,
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
            slide.addText(colors[1].join('\n'), {
                x: 'c',
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
            slide.addText(colors[2].join('\n'), {
                x: 585,
                y: 155,
                cx: 250,
                cy: 452,
                font_size: 18
            });
        }
        slide = pptx.makeNewSlide();
        slide.back = 'f8f8f8';
        slide.color = '878787';
        slide.addText(aliases.uniqueColor, {
            x: 75,
            y: 35,
            cx: 760,
            cy: 72,
            font_size: 36
        });
        colors = [];
        _.each(data.uniqueColor, function(value){
            labels.push(value);
            values.push(1);
            var rgb = color(value).rgb();
            colors.push(rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16));
        });
        slide.addChart({
            title: '',
            data: [{
                name: '',
                labels: labels,
                values: values,
                colors: colors
            }]}, 'pie', function(){});
    }

    // propertiesCount
    indexes = [];
    elements = [];
    iterator = 0;
    var chart = [];
    if (_.has(data, 'propertiesCount')) {
        _.each(data.propertiesCount, function(value){
            if (iterator > 12) {
                slide = pptx.makeNewSlide();
                slide.back = 'f8f8f8';
                slide.color = '878787';
                slide.addText(aliases.propertiesCount, {
                    x: 75,
                    y: 35,
                    cx: 760,
                    cy: 72,
                    font_size: 36
                });
                slide.addText('Total ' + aliases.propertiesCount + ': ' + data.propertiesCount.length, {
                    x: 75,
                    y: 107,
                    cx: 760,
                    cy: 48,
                    font_size: 24
                });
                slide.addText(indexes.join('\n'), {
                    x: 75,
                    y: 155,
                    cx: 440,
                    cy: 452,
                    font_size: 24
                });
                slide.addText(elements.join('\n'), {
                    x: 515,
                    y: 155,
                    cx: 320,
                    cy: 452,
                    font_size: 24
                });
                indexes = [];
                elements = [];
                iterator = 0;
            }
            indexes.push(value.property);
            elements.push(value.count);
            iterator += 1;
        });
        if (indexes.length > 0) {
            slide = pptx.makeNewSlide();
            slide.back = 'f8f8f8';
            slide.color = '878787';
            slide.addText(aliases.propertiesCount, {
                x: 75,
                y: 35,
                cx: 760,
                cy: 72,
                font_size: 36
            });
            slide.addText('Total ' + aliases.propertiesCount + ': ' + data.propertiesCount.length, {
                x: 75,
                y: 107,
                cx: 760,
                cy: 48,
                font_size: 24
            });
            slide.addText(indexes.join('\n'), {
                x: 75,
                y: 155,
                cx: 440,
                cy: 452,
                font_size: 24
            });
            slide.addText(elements.join('\n'), {
                x: 515,
                y: 155,
                cx: 320,
                cy: 452,
                font_size: 24
            });
        }
        slide = pptx.makeNewSlide();
        slide.back = 'f8f8f8';
        slide.color = '878787';
        slide.addText(aliases.propertiesCount, {
            x: 75,
            y: 35,
            cx: 760,
            cy: 72,
            font_size: 36
        });
        _.each(data.propertiesCount, function(value){
            chart.push({
                name: value.property,
                labels: [''],
                values: [parseInt(value.count, 10)]
            });
        });
        slide.addChart({
            title: '',
            data: chart
        }, 'bar', function(){});
    }

    var out = fs.createWriteStream(path.join(output, 'stylestats.pptx'));
    pptx.generate(out, {
        finalize: function(written){
            console.log ( 'Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n' );
        },
        error: function(err){
            console.log(err);
        }
    });
}

module.exports.Factory = Factory;
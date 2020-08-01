/**
 * GB-canvas-turntable.js
 * @class gbTurntable
 * @see https://github.com/givebest/GB-canvas-turntable
 * @author givenlovs@msn.com
 * @(c) 2016
 **/


(function () {
  var $,
    ele,
    container,
    canvas,     // referencia del elemento canvas
    num,        // cantidad de premios
    prizes,     // premios a mostrar en la ruleta
    btn,        // referencia al boton que inicia la ruleta
    deg = 0,    // almacena angulo de giro de la ruleta
    fnGetPrize, // referencia de funcion que se ejecuta para obtener la informacion de premios
    fnGotBack,  // referencia de funcion que se ejecuta al finalizar la ruleta
    optsPrize;  // informacion de premios 

  var cssPrefix,
    eventPrefix,
    vendors = {
      '': '',
      Webkit: 'webkit',
      Moz: '',
      O: 'o',
      ms: 'ms'
    },
    testEle = document.createElement('p'),
    cssSupport = {};

  // 嗅探特性 - olfateando propiedades
  Object.keys(vendors).some(function (vendor) {
    if (testEle.style[vendor + (vendor ? 'T' : 't') + 'ransitionProperty'] !== undefined) {
      cssPrefix = vendor ? '-' + vendor.toLowerCase() + '-' : '';
      eventPrefix = vendors[vendor];
      return true;
    }
  });

  /**
   * [兼容事件前缀] eventos compatibles prefijo
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  function normalizeEvent(name) {
    return eventPrefix ? eventPrefix + name : name.toLowerCase();
  }

  /**
   * [兼容CSS前缀] prefijo css Compatible
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  function normalizeCss(name) {
    name = name.toLowerCase();
    return cssPrefix ? cssPrefix + name : name;
  }

  cssSupport = {
    cssPrefix: cssPrefix,
    transform: normalizeCss('Transform'),
    transitionEnd: normalizeEvent('TransitionEnd')
  }

  var transform = cssSupport.transform;
  var transitionEnd = cssSupport.transitionEnd;
  var options;
  // alert(transform);
  // alert(transitionEnd);

  function init(opts) {
    fnGetPrize = opts.getPrize;
    fnGotBack = opts.gotBack;
    options = opts.options;
    opts.config(function (data) {
      prizes = opts.prizes = data;
      num = prizes.length;
      draw(opts);
    });

    events();
  }

  /**
   * @param  {String} id
   * @return {Object} HTML element
   */
  $ = function (id) {
    return document.getElementById(id);
  };

  /**
   * [绘制转盘]
   * @param  {String} id
   * @param  {Number} 奖品份数
   */
  function draw(opts) {
    opts = opts || {};
    if (!opts.id || num >>> 0 === 0) return;

    var anguloinicial = 0;
    var id = opts.id,
      rotateDeg = 360 / num / 2 + anguloinicial, // 扇形回转角度 ángulo de rotación del sector
      ctx,
      prizeItems = document.createElement('ul'), // 奖项容器 contenedor de premios
      turnNum = 1 / num, // 文字旋转 turn 值 valor a su vez la rotación de texto
      html = []; // 奖项

    ele = $(id);
    canvas = ele.querySelector('.gb-turntable-canvas');
    container = ele.querySelector('.gb-turntable-container');
    btn = ele.querySelector('.gb-turntable-btn');

    if (!canvas.getContext) {
      showMsg('¡Lo siento! Navegador no soportado'); // ¡Lo siento! Navegador no soporta
      return;
    }
    // 获取绘图上下文 Obtener dibujo contexto
    ctx = canvas.getContext('2d');
    //radio de la torta
    radio = 200; 

    for (var i = 0; i < num; i++) {
      // 保存当前状态 Guardar el estado actual
      ctx.save();
      // 开始一条新路径 Iniciar un nuevo camino
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转 Giro al centro, la siguiente necesidad de rotar alrededor del centro
      ctx.translate(radio, radio);
      // 从(0, 0)坐标开始定义一条新的子路径 A partir de (0, 0) de coordenadas define un nuevo sub-path
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。 
      // Arco de rotación, el ángulo debe ser convertido a radianes, utilizando grados * math.pi / 180 fórmula
      ctx.rotate((360 / num * i - rotateDeg) * Math.PI / 180);
      // console.log("rotateDeg: "+rotateDeg)
      // 绘制圆弧 Dibujar un arco
      ctx.arc(0, 0, radio, 0, 2 * Math.PI / num, false);

      // 颜色间隔 espaciado de color
      if (i % 2 == 0) {
        ctx.fillStyle = '#ffb820';
      } else {
        ctx.fillStyle = '#ffcb3f';
      }

      // 填充扇形 Lleno de ventilador
      ctx.fill();
      // 绘制边框 Dibujar un borde
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = '#e4370e';
      ctx.stroke();

      // 恢复前一个状态 Restaurar el estado anterior
      ctx.restore();

      // 奖项列表 Lista de premios
      var prizeList = opts.prizes;
      html.push('<li class="gb-turntable-item"> <span style="');
      html.push(transform + ': rotate(' + i * turnNum + 'turn)">');
      !!prizeList[i].img ? html.push('<img src="' + prizeList[i].img + '" />') : html.push(prizeList[i].text)
      html.push('</span> </li>');
      if ((i + 1) === num) {
        prizeItems.className = 'gb-turntalbe-list';
        container.appendChild(prizeItems);
        prizeItems.innerHTML = html.join('');
      }

    }

  }

  /**
   * [提示] rápido
   * @param  {String} msg [description]
   */
  function showMsg(msg) {
    alert(msg);
  }

  /**
   * [初始化转盘]
   * @return {[type]} [description]
   */
  /*  function runInit() {
      removeClass(container, 'gb-run');
      container.style[transform] = 'rotate(0deg)';
      container.style[transform] = '';
    }*/

  /**
   * 旋转转盘
   * @param  {[type]} deg [description]
   * @return {[type]}     [description]
   */
  function runRotate(deg) {
    // runInit();

    document.getElementById('contador').innerText=deg;
    // setTimeout(function() {
    // addClass(container, 'gb-run');
    // console.log(options)
    container.style[transform] = 'rotate(' + deg + 'deg)';
    // }, 10);
  }

  var tiempo = 1
  var anterior = 0
  var inicial = 3
  var cont = inicial
  var cantidadParticiones = 110
  var ease = null

  function sonido() {
      ease = bezier(.94,.13,.94,.56)
      options.audio_ruleta && reproAudio(options.audio_ruleta)

      anterior = tiempo
      tiempo =  6000 * ease(cont/(cantidadParticiones + inicial));
      let total = tiempo - anterior
      cont++
      document.getElementById('contador').innerText = cont;
      if(cont < (cantidadParticiones + inicial)){
        // sonido(tiempo, cont+1)
        let interval = setTimeout(sonido, total )
      }
  }
  /**
   * 抽奖事件
   * @return {[type]} [description]
   */
  function events() {
    bind(btn, 'click', function () {

      cont = inicial
      sonido() 
      /*      var prizeId,
                chances;*/

      addClass(btn, 'disabled');

      fnGetPrize(function (data) {
        optsPrize = {
          prizeId: data[0],
          chances: data[1]
        }
        // 计算旋转角度 El cálculo de un ángulo de rotación
        deg = deg || 0;
        vueltas =  (360 - deg % 360) + (360 * 10 - data[0] * (360 / num))
        
        cantidadParticiones = vueltas / (360 / num)
        deg = deg + vueltas

        console.log("angulo rotacion: "+vueltas + " - cantidadParticiones: "+cantidadParticiones)
        // calculo de 
        runRotate(deg);
      });

      // 中奖提示 Tip ganar - evento que se ejecuta cuando finalice la transicion (animacion de ruleta)
      bind(container, transitionEnd, eGot);
    });
  }

  function eGot() {

    options.audio_gano && reproAudio(options.audio_gano, ()=>{
      fnGotBack(prizes[optsPrize.prizeId].text);
      if (optsPrize.chances) removeClass(btn, 'disabled');
    });
  }

  /**
   * 
   * @param {String} urlaudio url http/local de archivo de audio
   * @param {Function} callback ejecutada cuando la reproduccion del audio finaliza
   */
  function reproAudio(urlaudio, callback = null) {
      let volum = ease(cont/(cantidadParticiones + inicial))
      var sound = new Howl({
        src: [urlaudio],
        volume: volum,
        onend: callback
      });
      sound.play()
  }

  /**
   * Bind events to elements
   * @param {Object}    ele    HTML Object
   * @param {Event}     event  Event to detach
   * @param {Function}  fn     Callback function
   */
  function bind(ele, event, fn) {
    if (typeof addEventListener === 'function') {
      ele.addEventListener(event, fn, false);
    } else if (ele.attachEvent) {
      ele.attachEvent('on' + event, fn);
    }
  }

  /**
   * Unbind events to elements
   * @param {Object}    ele    HTML Object
   * @param {Event}     event  Event to detach
   * @param {Function}  fn     Callback function
   */
  /*  function unbind(ele, event, fn) {
        if (typeof removeEventListener === 'function') {
            ele.removeEventListener(event, fn, false);
        } else if (ele.detachEvent) {
            ele.detach('on' + event, fn);
        }
    }*/

  /**
   * hasClass
   * @param {Object} ele   HTML Object
   * @param {String} cls   className
   * @return {Boolean}
   */
  function hasClass(ele, cls) {
    if (!ele || !cls) return false;
    if (ele.classList) {
      return ele.classList.contains(cls);
    } else {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }
  }

  // addClass
  function addClass(ele, cls) {
    if (ele.classList) {
      ele.classList.add(cls);
    } else {
      if (!hasClass(ele, cls)) ele.className += '' + cls;
    }
  }

  // removeClass
  function removeClass(ele, cls) {
    if (ele.classList) {
      ele.classList.remove(cls);
    } else {
      ele.className = ele.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  var gbTurntable = {
    init: function (opts) {
      return init(opts);
    }
  }

  // (@see https://github.com/madrobby/zepto/blob/master/src/zepto.js)
  window.gbTurntable === undefined && (window.gbTurntable = gbTurntable);

  // AMD (@see https://github.com/jashkenas/underscore/blob/master/underscore.js)
  if (typeof define == 'function' && define.amd) {
    define('GB-canvas-turntable', [], function () {
      return gbTurntable;
    });
  }

}());

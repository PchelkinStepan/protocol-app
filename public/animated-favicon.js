// public/animated-favicon.js

(function() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    let frame = 0;
    let animationId = null;
    
    // Мягкие, "бумажные" цвета
    const colors = {
      bg: '#f5f0e8',       // цвет старой бумаги/пергамента
      shadow: '#d4c9b8',   // тень на бумаге
      ink: '#000000',      // ЧИСТЫЙ ЧЕРНЫЙ цвет чернил
      inkLight: '#222222', // темно-серые чернила
      accent: '#111111',   // почти черный
      paperFold: '#e8e0d5' // сгиб/край бумаги
    };
    
    function drawFrame() {
      ctx.clearRect(0, 0, 64, 64);
      
      // 1. Фон как поверхность стола (очень светлый)
      ctx.fillStyle = '#e0dcd5';
      ctx.fillRect(0, 0, 64, 64);
      
      // 2. Лист бумаги с легкой тенью
      ctx.fillStyle = colors.shadow;
      ctx.fillRect(9, 9, 48, 48);
      
      // 3. Сам документ
      ctx.fillStyle = colors.bg;
      ctx.beginPath();
      ctx.roundRect(8, 8, 48, 48, 4);
      ctx.fill();
      
      // 4. Эффект сгиба/края бумаги (очень тонкий)
      ctx.strokeStyle = colors.paperFold;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.roundRect(8, 8, 48, 48, 4);
      ctx.stroke();
      
      // 5. Линии текста как будто написаны ручкой (слегка неровные)
      const lines = [
        { y: 20, width: 28, delay: 0, speed: 0.12 },
        { y: 28, width: 24, delay: 0.3, speed: 0.1 },
        { y: 36, width: 20, delay: 0.6, speed: 0.15 },
        { y: 44, width: 32, delay: 0.9, speed: 0.08 }
      ];
      
      lines.forEach(line => {
        let progress = Math.sin(frame * line.speed - line.delay);
        progress = (progress + 1) / 2;
        
        const currentWidth = line.width * Math.min(1, progress * 1.2);
        
        if (currentWidth > 0.5) {
          const shake = Math.sin(frame * 0.5) * 0.3;
          
          ctx.beginPath();
          ctx.moveTo(16 + shake, line.y);
          ctx.lineTo(16 + currentWidth + shake, line.y);
          ctx.strokeStyle = colors.ink;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(16 + shake, line.y, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = colors.ink;
          ctx.fill();
        }
      });
      
      // 6. Рукописная галочка (как подпись поверителя)
      const signProgress = Math.sin(frame * 0.08);
      if (signProgress > 0) {
        const signLength = Math.min(1, signProgress * 1.2);
        
        ctx.beginPath();
        ctx.moveTo(40, 48);
        ctx.lineTo(44, 52);
        ctx.lineTo(52, 44);
        ctx.strokeStyle = colors.ink;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        
        if (signProgress > 0.9) {
          ctx.beginPath();
          ctx.arc(52, 44, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = colors.ink;
          ctx.fill();
        }
      }
      
      // 7. Очень легкая текстура бумаги (точки)
      if (frame % 30 < 15) {
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
          ctx.beginPath();
          ctx.arc(12 + Math.random() * 40, 15 + Math.random() * 38, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      frame++;
      
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = canvas.toDataURL('image/x-icon');
      
      animationId = requestAnimationFrame(drawFrame);
    }
    
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x+r, y);
        this.lineTo(x+w-r, y);
        this.quadraticCurveTo(x+w, y, x+w, y+r);
        this.lineTo(x+w, y+h-r);
        this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        this.lineTo(x+r, y+h);
        this.quadraticCurveTo(x, y+h, x, y+h-r);
        this.lineTo(x, y+r);
        this.quadraticCurveTo(x, y, x+r, y);
        return this;
      };
    }
    
    drawFrame();
  })();
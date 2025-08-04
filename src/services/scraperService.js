import openai from './openaiClient';
import axios from 'axios';

/**
 * Enhanced scraper service using OpenAI and Crawl4AI for intelligent content extraction
 * Supports high-availability, fault-tolerant scraping operations for diventus.eu
 */
class ScraperService {
  constructor() {
    this.crawl4aiEndpoint = 'http://localhost:8000'; // Crawl4AI server endpoint
    this.platforms = this.initializePlatforms();
    this.activeJobs = new Map();
    this.retryAttempts = 3;
    this.requestTimeout = 30000;
  }

  /**
   * Initialize platform configurations from the provided list
   */
  initializePlatforms() {
    return [
      {
        id: 'ted-europa',
        name: 'Tenders Electronic Daily (TED) – EU-Amtsblatt für öffentl. Aufträge',
        url: 'https://ted.europa.eu',
        region: 'EU-weit (inkl. DACH)',
        requiresAuth: false,
        itSpecific: 'partial',
        categories: ['all-sectors', 'it-cpv-filterable'],
        scraperConfig: {
          selectors: {
            tenderList: '.notice-list .notice-item',
            title: '.notice-title',
            description: '.notice-description',
            deadline: '.deadline-date',
            value: '.contract-value',
            category: '.cpv-code'
          },
          pagination: '.pagination a[rel="next"]',
          rateLimit: 2000, // 2 seconds between requests
          maxRetries: 3
        }
      },
      {
        id: 'service-bund-de',
        name: 'service.bund.de – Ausschreibungsdatenbank des Bundes (Deutschland)',
        url: 'https://service.bund.de',
        region: 'Deutschland (Bund, Länder, Kommunen)',
        requiresAuth: false,
        itSpecific: 'partial',
        categories: ['public-tenders', 'it-category'],
        scraperConfig: {
          selectors: {
            tenderList: '.tender-results .tender-item',
            title: '.tender-title',
            description: '.tender-description',
            deadline: '.submission-deadline',
            value: '.estimated-value',
            category: '.tender-category'
          },
          pagination: '.pagination .next-page',
          rateLimit: 1500,
          maxRetries: 3
        }
      },
      {
        id: 'evergabe-online',
        name: 'e-Vergabe (Bund) – Vergabeplattform des Bundes (Deutschland)',
        url: 'https://evergabe-online.de',
        region: 'Deutschland (Bundesbehörden)',
        requiresAuth: true,
        itSpecific: false,
        categories: ['federal-tenders', 'above-threshold'],
        scraperConfig: {
          authRequired: true,
          loginSelectors: {
            usernameField: '#username',
            passwordField: '#password',
            submitButton: '.login-submit'
          },
          selectors: {
            tenderList: '.procurement-list .procurement-item',
            title: '.procurement-title',
            description: '.procurement-details',
            deadline: '.deadline-info',
            value: '.contract-value',
            category: '.procurement-type'
          },
          rateLimit: 3000,
          maxRetries: 5
        }
      },
      // Additional platforms from the provided list
      {
        id: 'dtvp-de',
        name: 'Deutsches Vergabeportal (DTVP) – Zentrales E-Vergabe-Portal',
        url: 'https://dtvp.de',
        region: 'Deutschland',
        requiresAuth: true,
        itSpecific: false,
        categories: ['all-sectors', 'it-filterable'],
        scraperConfig: {
          authRequired: true,
          rateLimit: 2500,
          maxRetries: 3
        }
      },
      {
        id: 'it-ausschreibung-de',
        name: 'IT-Ausschreibung.de – IT-Auftragsbörse',
        url: 'https://it-ausschreibung.de',
        region: 'Deutschland (DACH)',
        requiresAuth: true,
        itSpecific: true,
        categories: ['it-only', 'software', 'hardware', 'consulting'],
        scraperConfig: {
          authRequired: true,
          rateLimit: 2000,
          maxRetries: 3,
          specialization: 'it-focused'
        }
      },
      {
        id: 'vergabepilot-ai',
        name: 'Vergabepilot AI – KI-basierte Ausschreibungssuche',
        url: 'https://vergabepilot.ai',
        region: 'Deutschland',
        requiresAuth: true,
        itSpecific: false,
        categories: ['ai-assisted', 'sme-focused'],
        scraperConfig: {
          authRequired: true,
          aiEnhanced: true,
          rateLimit: 3000,
          maxRetries: 3
        }
      },
      {
        id: 'tendara-ai',
        name: 'Tendara – KI-gestützter Vergabeassistent',
        url: 'https://tendara.ai',
        region: 'Deutschland & EU',
        requiresAuth: true,
        itSpecific: false,
        categories: ['ai-assisted', 'profile-matching'],
        scraperConfig: {
          authRequired: true,
          aiEnhanced: true,
          rateLimit: 3000,
          maxRetries: 3
        }
      },
      // Austrian platforms
      {
        id: 'usp-gv-at',
        name: 'Unternehmens-serviceportal (USP) – Ausschreibungssuche (Österreich)',
        url: 'https://ausschreibungen.usp.gv.at',
        region: 'Österreich (bundesweit)',
        requiresAuth: false,
        itSpecific: false,
        categories: ['public-tenders', 'cpv-categories'],
        scraperConfig: {
          rateLimit: 2000,
          maxRetries: 3
        }
      },
      {
        id: 'anko-vergabeportal',
        name: 'ANKÖ Vergabeportal – Auftragsdatenbank Österreich',
        url: 'https://vergabeportal.at',
        region: 'Österreich, EU, intl.',
        requiresAuth: true,
        itSpecific: false,
        categories: ['comprehensive', 'it-filterable'],
        scraperConfig: {
          authRequired: true,
          rateLimit: 2500,
          maxRetries: 3,
          trialAvailable: true
        }
      },
      // Swiss platforms
      {
        id: 'simap-ch',
        name: 'SIMAP – Schweizer Beschaffungsplattform (offiziell)',
        url: 'https://simap.ch',
        region: 'Schweiz (Bund, Kantone, Gemeinden)',
        requiresAuth: true,
        itSpecific: false,
        categories: ['official', 'all-sectors'],
        scraperConfig: {
          authRequired: true,
          rateLimit: 2000,
          maxRetries: 3
        }
      },
      {
        id: 'it-beschaffung-ch',
        name: 'IT-Beschaffung.ch – Ausschreibungsindex (CH, inoffiziell)',
        url: 'https://it-beschaffung.ch',
        region: 'Schweiz',
        requiresAuth: false,
        itSpecific: true,
        categories: ['it-focused', 'simap-based'],
        scraperConfig: {
          rateLimit: 1500,
          maxRetries: 3,
          dataSource: 'simap-aggregated'
        }
      }
    ];
  }

  /**
   * Start scraping operation for a specific platform
   */
  async startScraping(platformId, options = {}) {
    const platform = this.platforms?.find(p => p?.id === platformId);
    if (!platform) {
      throw new Error(`Platform ${platformId} not found`);
    }

    const jobId = `job_${platformId}_${Date.now()}`;
    
    try {
      this.activeJobs?.set(jobId, {
        platformId,
        status: 'running',
        startTime: new Date(),
        progress: 0,
        recordsProcessed: 0,
        errors: []
      });

      // Use Crawl4AI for intelligent crawling
      const crawlResult = await this.crawlWithAI(platform, options);
      
      // Process results with OpenAI for intelligent extraction
      const processedData = await this.processWithOpenAI(crawlResult, platform);
      
      // Update job status
      this.updateJobStatus(jobId, {
        status: 'completed',
        progress: 100,
        recordsProcessed: processedData?.length,
        completedAt: new Date(),
        data: processedData
      });

      return {
        jobId,
        status: 'completed',
        recordsProcessed: processedData?.length,
        data: processedData
      };

    } catch (error) {
      this.updateJobStatus(jobId, {
        status: 'failed',
        error: error?.message,
        failedAt: new Date()
      });
      throw error;
    }
  }

  /**
   * Use Crawl4AI for intelligent web crawling
   */
  async crawlWithAI(platform, options = {}) {
    const crawlConfig = {
      urls: [platform?.url],
      extraction_strategy: 'ai',
      chunking_strategy: 'by_topic',
      screenshot: true,
      pdf_extraction: true,
      remove_overlay_elements: true,
      simulate_user: true,
      magic: true, // Enable AI-powered content understanding
      ...options
    };

    try {
      const response = await axios?.post(`${this.crawl4aiEndpoint}/crawl`, crawlConfig, {
        timeout: this.requestTimeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response?.data;
    } catch (error) {
      console.error('Crawl4AI error:', error);
      // Fallback to basic crawling if AI fails
      return await this.basicCrawl(platform, options);
    }
  }

  /**
   * Fallback basic crawling method
   */
  async basicCrawl(platform, options = {}) {
    try {
      const response = await axios?.get(platform?.url, {
        timeout: this.requestTimeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      return {
        content: response?.data,
        url: platform?.url,
        status: 'success',
        timestamp: new Date()?.toISOString()
      };
    } catch (error) {
      throw new Error(`Basic crawl failed: ${error.message}`);
    }
  }

  /**
   * Process crawled data with OpenAI for intelligent extraction
   */
  async processWithOpenAI(crawlData, platform) {
    const extractionPrompt = `
      Analyze the following tender/procurement data from ${platform?.name} and extract structured information.
      Focus on extracting:
      1. Tender titles and descriptions
      2. Submission deadlines
      3. Contract values
      4. Categories/CPV codes
      5. Contracting authorities
      6. Requirements and specifications
      7. Contact information

      Platform context: ${platform?.region} - ${platform?.categories?.join(', ')}
      IT-specific focus: ${platform?.itSpecific}

      Raw data: ${JSON.stringify(crawlData)?.substring(0, 15000)}

      Please return a JSON array of tender objects with the following structure:
      {
        "tenders": [
          {
            "title": "string",
            "description": "string",
            "deadline": "ISO date string",
            "value": "number or string",
            "currency": "string",
            "category": "string",
            "cpvCodes": ["string"],
            "authority": "string",
            "requirements": ["string"],
            "contactInfo": {
              "email": "string",
              "phone": "string",
              "address": "string"
            },
            "url": "string",
            "platformId": "${platform?.id}",
            "extractedAt": "${new Date()?.toISOString()}"
          }
        ]
      }
    `;

    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert at extracting structured tender/procurement data from web content. Return valid JSON only.' },
          { role: 'user', content: extractionPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'tender_extraction',
            schema: {
              type: 'object',
              properties: {
                tenders: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      deadline: { type: 'string' },
                      value: { type: 'string' },
                      currency: { type: 'string' },
                      category: { type: 'string' },
                      cpvCodes: { type: 'array', items: { type: 'string' } },
                      authority: { type: 'string' },
                      requirements: { type: 'array', items: { type: 'string' } },
                      contactInfo: {
                        type: 'object',
                        properties: {
                          email: { type: 'string' },
                          phone: { type: 'string' },
                          address: { type: 'string' }
                        }
                      },
                      url: { type: 'string' },
                      platformId: { type: 'string' },
                      extractedAt: { type: 'string' }
                    },
                    required: ['title', 'platformId', 'extractedAt']
                  }
                }
              },
              required: ['tenders']
            }
          }
        },
        temperature: 0.1,
        max_tokens: 4000
      });

      const result = JSON.parse(response?.choices?.[0]?.message?.content);
      return result?.tenders || [];

    } catch (error) {
      console.error('OpenAI processing error:', error);
      // Return basic extracted data as fallback
      return this.basicDataExtraction(crawlData, platform);
    }
  }

  /**
   * Fallback basic data extraction
   */
  basicDataExtraction(crawlData, platform) {
    return [{
      title: `Scraped content from ${platform?.name}`,
      description: `Raw data extracted from ${crawlData?.url}`,
      platformId: platform?.id,
      extractedAt: new Date()?.toISOString(),
      url: crawlData?.url,
      rawContent: crawlData?.content?.substring(0, 1000) + '...'
    }];
  }

  /**
   * Get all available platforms
   */
  getPlatforms() {
    return this.platforms;
  }

  /**
   * Get platform by ID
   */
  getPlatform(id) {
    return this.platforms?.find(p => p?.id === id);
  }

  /**
   * Get active scraping jobs
   */
  getActiveJobs() {
    return Array.from(this.activeJobs?.entries())?.map(([jobId, job]) => ({
      id: jobId,
      ...job
    }));
  }

  /**
   * Get job status
   */
  getJobStatus(jobId) {
    return this.activeJobs?.get(jobId);
  }

  /**
   * Update job status
   */
  updateJobStatus(jobId, updates) {
    const existingJob = this.activeJobs?.get(jobId);
    if (existingJob) {
      this.activeJobs?.set(jobId, { ...existingJob, ...updates });
    }
  }

  /**
   * Stop scraping job
   */
  stopJob(jobId) {
    const job = this.activeJobs?.get(jobId);
    if (job && job?.status === 'running') {
      this.updateJobStatus(jobId, {
        status: 'stopped',
        stoppedAt: new Date()
      });
      return true;
    }
    return false;
  }

  /**
   * Batch scraping for multiple platforms
   */
  async batchScrape(platformIds, options = {}) {
    const results = [];
    const concurrency = options?.concurrency || 3;
    
    for (let i = 0; i < platformIds?.length; i += concurrency) {
      const batch = platformIds?.slice(i, i + concurrency);
      const batchPromises = batch?.map(platformId => 
        this.startScraping(platformId, options)?.catch(error => ({
          platformId,
          error: error?.message,
          status: 'failed'
        }))
      );
      
      const batchResults = await Promise.all(batchPromises);
      results?.push(...batchResults);
      
      // Rate limiting between batches
      if (i + concurrency < platformIds?.length) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    return results;
  }

  /**
   * Health check for the scraper service
   */
  async healthCheck() {
    const health = {
      status: 'healthy',
      timestamp: new Date()?.toISOString(),
      activeJobs: this.activeJobs?.size,
      platforms: this.platforms?.length,
      services: {
        openai: 'unknown',
        crawl4ai: 'unknown'
      }
    };

    // Check OpenAI connection
    try {
      await openai?.models?.list();
      health.services.openai = 'healthy';
    } catch (error) {
      health.services.openai = 'error';
      health.status = 'degraded';
    }

    // Check Crawl4AI connection
    try {
      await axios?.get(`${this.crawl4aiEndpoint}/health`, { timeout: 5000 });
      health.services.crawl4ai = 'healthy';
    } catch (error) {
      health.services.crawl4ai = 'error';
      health.status = 'degraded';
    }

    return health;
  }
}

// Create singleton instance
const scraperService = new ScraperService();

export default scraperService;
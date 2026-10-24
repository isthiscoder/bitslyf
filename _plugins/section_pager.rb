# Section pages, split into numbered pages automatically.
#
# Any page with `collection:` and `per_page:` in its front matter
# (analysis.html, research.html, prediction.html, thesis.html, rfs.html)
# becomes page 1. As you add posts, /analysis/page2/, /analysis/page3/ …
# appear on their own. Nothing to copy or edit.
module SectionPager
  class Generator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      site.pages.select { |pg| pg.data["collection"] && pg.data["per_page"] }.each do |first|
        coll = site.collections[first.data["collection"]]
        next unless coll
        per = first.data["per_page"].to_i
        next if per < 1
        total_items = coll.docs.size
        total_pages = [(total_items + per - 1) / per, 1].max
        base = first.url

        first.data["page_num"] = 1
        first.data["total_pages"] = total_pages
        first.data["total_items"] = total_items
        first.data["base_url"] = base

        (2..total_pages).each do |n|
          pg = Jekyll::PageWithoutAFile.new(site, site.source, File.join(base, "page#{n}"), "index.html")
          pg.content = first.content
          pg.data = Jekyll::Utils.deep_merge_hashes(first.data, {
            "page_num" => n,
            "permalink" => "#{base}page#{n}/"
          })
          site.pages << pg
        end
      end
    end
  end
end
